import { Database } from "arangojs";
import IDatasource from "./idatasource";
import IRoute from "../models/iroute";
import ITravelTime from "../models/itravel-time";

class ArangoDatasource implements IDatasource {
  private static readonly ROUTE_COLLECTION_NAME = "routes";
  private static readonly TRAVEL_TIME_COLLECTION_NAME = "travelTimes";
  private static readonly TRAVEL_TIME_EDGECOLLECTION_NAME = "travelTimeEdges";

  private defaultCredentialsUrl = "http://localhost:5000/credentials";
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
      const response = await window.fetch(this.credentialsUrl);
      const credentials = await response.json();
      const arangoConfig = credentials["arango"];
      this.arangoDb = new Database(arangoConfig.host);
      this.arangoDb.useDatabase(arangoConfig.database);
      this.arangoDb.useBasicAuth(arangoConfig.username, arangoConfig.password);
    } catch (e) {
      return false;
    }

    return true;
  }

  public async getRoute(routeName: string): Promise<IRoute | undefined> {
    if (!this.arangoDb) {
      return undefined;
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);
    if (!routeCollection.documentExists(routeName)) {
      return undefined;
    }
    try {
      return await routeCollection.document(routeName);
    } catch (e) {
      return undefined;
    }
  }

  public async createRoute(newRoute: IRoute): Promise<IRoute | undefined> {
    if (!this.arangoDb) {
      return undefined;
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);
    if (!newRoute._key) {
      newRoute._key = newRoute.routeName;
    }
    let savedRoute;
    try {
      savedRoute = routeCollection.save(newRoute);
    } catch (e) {
      console.error(`Unable to save route: ${newRoute.routeName}`, e.message);
    }
    return savedRoute;
  }

  public async saveTravelTime(travelTime: ITravelTime): Promise<ITravelTime | undefined> {
    if (!this.arangoDb) {
      return undefined;
    }
    const travelTimeCollection = this.arangoDb.collection(ArangoDatasource.TRAVEL_TIME_COLLECTION_NAME);
    const travelTimeEdgeCollection = this.arangoDb.collection(ArangoDatasource.TRAVEL_TIME_EDGECOLLECTION_NAME);
    let savedTravelTime;
    try {
      savedTravelTime = await travelTimeCollection.save(travelTime);
      const fromKey = `${ArangoDatasource.ROUTE_COLLECTION_NAME}/${travelTime.routeName}`;
      travelTimeEdgeCollection.save({ _from: fromKey, _to: savedTravelTime._id });
    } catch (e) {
      console.error(`Unable to save travel time for route: ${travelTime.routeName}`, e);
    }

    return savedTravelTime;
  }
}

export default ArangoDatasource;
