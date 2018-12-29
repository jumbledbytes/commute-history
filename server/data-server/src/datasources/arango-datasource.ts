import { Database } from "arangojs";
import * as request from "request-promise";

import IDatasource from "./idatasource";
import IRoute from "../../../../common/models/iroute";
import ITravelTime from "../../../../common/models/itravel-time";
import IArangoDocument from "../../../../common/models/arango-document";

class ArangoDatasource implements IDatasource {
  private static readonly ROUTE_COLLECTION_NAME = "routes";

  private defaultCredentialsUrl = "http://localhost:4000/credentials/arangodb";
  private credentialsUrl: string;
  private arangoDb: Database | undefined;

  constructor(url?: string) {
    this.credentialsUrl = url || this.defaultCredentialsUrl;
  }

  public async connect(): Promise<boolean> {
    if (this.arangoDb) {
      return true;
    }
    try {
      const response = await request(this.credentialsUrl);
      const credentials = JSON.parse(response);
      const arangoConfig = credentials["arango"];
      this.arangoDb = new Database(arangoConfig.host);
      this.arangoDb.useDatabase(arangoConfig.database);
      this.arangoDb.useBasicAuth(arangoConfig.username, arangoConfig.password);
    } catch (e) {
      console.log(e.message);
      return false;
    }

    return true;
  }

  public async getRoutes(): Promise<Array<IRoute>> {
    if (!this.arangoDb) {
      await this.connect();
      if (!this.arangoDb) {
        console.log("Not connected to database");
        return [];
      }
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);
    const routeCursor = await routeCollection.all();
    const routeDocuments = await routeCursor.all();
    return routeDocuments;
  }

  public async getRoute(routeName: string): Promise<IRoute | undefined> {
    if (!this.arangoDb) {
      await this.connect();
      if (!this.arangoDb) {
        console.log("Not connected to database");
        return undefined;
      }
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);
    if (!routeCollection.documentExists(routeName)) {
      return undefined;
    }
    try {
      return await routeCollection.document(routeName);
    } catch (e) {
      console.log(e.message);
      return undefined;
    }
  }

  public async getTravelTimes(routeName: string): Promise<Array<ITravelTime>> {
    if (!this.arangoDb) {
      await this.connect();
      if (!this.arangoDb) {
        console.log("Not connected to database");
        return [];
      }
    }
    const routeKey = `${ArangoDatasource.ROUTE_COLLECTION_NAME}/${routeName}`;
    const travelTimesGraph = this.arangoDb.graph("travelTimesGraph");
    try {
      const travelTimes = await travelTimesGraph.traversal(routeKey, {
        direction: "outbound",
        visitor: "result.vertices.push(vertex);",
        init: "result.vertices = [];"
      });
      const route = travelTimes.vertices.find((item: IArangoDocument) => item._key === routeName);

      return travelTimes.vertices
        .filter((item: IArangoDocument) => item._key !== routeName)
        .map((item: ITravelTime) => {
          return {
            ...item,
            route
          };
        })
        .filter(Boolean);
    } catch (e) {
      console.log(e.message);
      return [];
    }
  }
}

export default ArangoDatasource;
