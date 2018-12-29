import IMap from "../imap";
import IMapCallbacks from "../imap-callbacks";
import IRoute from "../../../../../../common/models/iroute";

declare var mapboxgl: any;

class MapboxMap implements IMap {
  public static DEFAULT_MAP_NAME = "mapbox-map";
  private _map: any;

  get map(): any {
    return this._map;
  }

  constructor(public readonly mapName: string, private _accessToken: any, private _callbacks: IMapCallbacks) {}

  public async init() {
    return new Promise(resolve => {
      mapboxgl.accessToken = this._accessToken.mapboxgl.accessToken;
      this._map = new mapboxgl.Map({
        container: this.mapName,
        style: "mapbox://styles/mapbox/streets-v11"
      });
      this._callbacks.onMapLoaded();
      resolve();
    });
  }

  public requestDirections(route: IRoute) {}

  public handleDirectionsResponse = (route: IRoute, error: any, data: any) => {
    if (this._callbacks.onDirectionsAvailable) {
      this._callbacks.onDirectionsAvailable(route, error, data);
    }
  };
}

export default MapboxMap;
