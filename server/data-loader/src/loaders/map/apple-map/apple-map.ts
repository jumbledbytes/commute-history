import IMap from "../imap";
import IMapCallbacks from "../imap-callbacks";
import IRoute from "../../../../../../common/models/iroute";
import IDirectionsRequest from "../../../types/idirections-request";
import IDirections from "../../../types/idirections";
import ITravelTime from "../../../../../../common/models/itravel-time";
import IDatasource from "../../../datasources/idatasource";

declare var mapkit: any;

class AppleMap implements IMap {
  public static DEFAULT_MAP_NAME = "apple-map";

  private _map: any;

  constructor(public readonly mapName: string, private accessToken: any, private datasource: IDatasource) {}

  public get map(): any {
    return this.map;
  }

  public async init() {
    return new Promise(resolve => {
      mapkit.init({
        authorizationCallback: (done: (value: string) => undefined) => {
          done(this.accessToken.token);
          resolve();
        }
      });
    });
  }

  public requestDirections(route: IRoute, callbacks: IMapCallbacks) {
    const request: IDirectionsRequest = {
      origin: route.origin,
      destination: route.destination,
      transportType: mapkit.Directions.Transport.Automobile,
      requestsAlternateRoutes: false
    };
    const myDirections = new mapkit.Directions();
    myDirections.route(request, (error: any, data: any) =>
      this.handleDirectionsResponse(route, error, data, callbacks)
    );
  }

  public handleDirectionsResponse = (route: IRoute, error: any, data: any, callbacks: IMapCallbacks) => {
    if (callbacks.onDirectionsAvailable) {
      const directions: IDirections = {
        route: route,
        travelTime: data.routes[0].expectedTravelTime,
        meta: data,
        map: this
      };
      callbacks.onDirectionsAvailable(error, directions);
    }
  };

  public async saveDirections(directions: IDirections) {
    const routeDocument = await this.datasource.getRoute(directions.route.routeName);
    if (!routeDocument) {
      this.datasource.createRoute(directions.route);
    }

    const travelTime: ITravelTime = {
      routeName: directions.route.routeName,
      travelTime: directions.travelTime,
      source: this.map.mapName,
      createdAt: new Date()
    };

    this.datasource.saveTravelTime(travelTime);
  }
}

export default AppleMap;
