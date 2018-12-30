import { Database, aql } from "arangojs";
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
    try {
      const query = ` LET route = (
        FOR r in routes
          FILTER r.routeName == "${routeName}"
          return r
      )
      lET travelTimes = (
        FOR vertices, edges, paths IN 1..1 OUTBOUND "${routeKey}" travelTimeEdges
          FILTER DATE_DIFF(vertices.createdAt, DATE_NOW(), 'd', true) < 2.0
          return vertices
      )
      
      return [route, travelTimes]`;
      const travelTimesCursor = await this.arangoDb.query(query);
      const travelTimeData = await travelTimesCursor.all();
      const routes = travelTimeData[0][0];
      const travelTimes = travelTimeData[0][1];
      const route = routes[0];

      return travelTimes
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
