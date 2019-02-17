import { Database } from "arangojs";
import IDatasource from "./idatasource";
import IRoute from "../../../../common/models/iroute";
import ITravelTime from "../../../../common/models/itravel-time";

declare var window: any;

class ArangoDatasource implements IDatasource {
  private static readonly ROUTE_COLLECTION_NAME = "routes";
  private static readonly TRAVEL_TIME_COLLECTION_NAME = "travelTimes";
  private static readonly TRAVEL_TIME_EDGECOLLECTION_NAME = "travelTimeEdges";

  private defaultCredentialsUrl = "http://localhost:4000/credentials/arangodb";
  private credentialsUrl: string;
  private arangoDb: Database | undefined;

  constructor(url?: string) {
    this.credentialsUrl = url || this.defaultCredentialsUrl;
  }

  public async connect(fetch?: any): Promise<boolean> {
    if (this.arangoDb) {
      return true;
    }
    try {
      const fetchInstance = fetch || (window && window.fetch);
      const response = await fetchInstance(this.credentialsUrl);
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

  public async getRoutes(): Promise<Array<IRoute>> {
    if (!this.arangoDb) {
      return [];
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);

    try {
      const routesCursor = await routeCollection.all();
      const routes = routesCursor.all();
      return routes;
    } catch (e) {
      return [];
    }
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
      const route = await routeCollection.document(routeName);
      return route;
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

  public async saveRoute(route: IRoute): Promise<boolean> {
    if (!this.arangoDb || !route.routeName) {
      return false;
    }
    const routeCollection = this.arangoDb.collection(ArangoDatasource.ROUTE_COLLECTION_NAME);
    if (!route._key) {
      route._key = route.routeName;
    }
    try {
      if (routeCollection.documentExists(route.routeName)) {
        routeCollection.update(route.routeName, route);
      } else {
        routeCollection.save(route);
      }
    } catch (e) {
      return false;
    }

    return true;
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
      console.log(
        new Date().toString() +
          `: Saved travel time of ${Math.floor(travelTime.travelTime / 60)} for ${travelTime.routeName}`
      );
    } catch (e) {
      console.error(`${new Date().toString()}: Unable to save travel time for route: ${travelTime.routeName}`, e);
    }

    return savedTravelTime;
  }
}

export default ArangoDatasource;
