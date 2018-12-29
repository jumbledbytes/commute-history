import IMap from "../imap";
import IMapCallbacks from "../imap-callbacks";
import IRoute from "../../../../../../common/models/iroute";
import IDirectionsRequest from "../../../types/idirections-request";
import { callbackify } from "util";

declare var mapkit: any;

class AppleMap implements IMap {
  public static DEFAULT_MAP_NAME = "apple-map";

  private _map: any;

  constructor(public readonly mapName: string, private accessToken: any, private callbacks: IMapCallbacks) {}

  public get map(): any {
    return this.map;
  }

  public async init() {
    return new Promise(resolve => {
      mapkit.init({
        authorizationCallback: (done: (value: string) => undefined) => {
          done(this.accessToken.token);
          this.callbacks.onMapLoaded();
          resolve();
        }
      });
    });
  }

  public requestDirections(route: IRoute) {
    const request: IDirectionsRequest = {
      origin: route.origin,
      destination: route.destination,
      transportType: mapkit.Directions.Transport.Automobile,
      requestsAlternateRoutes: false
    };
    const myDirections = new mapkit.Directions();
    myDirections.route(request, (error: any, data: any) => this.handleDirectionsResponse(route, error, data));
  }

  public handleDirectionsResponse = (route: IRoute, error: any, data: any) => {
    if (this.callbacks.onDirectionsAvailable) {
      this.callbacks.onDirectionsAvailable(route, error, data);
    }
  };
}

export default AppleMap;
