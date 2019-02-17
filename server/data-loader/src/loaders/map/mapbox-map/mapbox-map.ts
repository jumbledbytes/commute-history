import IMap from "../imap";
import IMapCallbacks from "../imap-callbacks";
import IRoute from "../../../../../../common/models/iroute";
import IDirections from "../../../types/idirections";
import IDatasource from "../../../datasources/idatasource";
import ITravelTime from "../../../../../../common/models/itravel-time";

declare var window: any;

class MapboxMap implements IMap {
  public static DEFAULT_MAP_NAME = "mapbox-map";
  private _map: any;

  private mapboxApiUrl = "https://api.mapbox.com/directions/v5/mapbox/driving-traffic";

  get map(): any {
    return this._map;
  }

  constructor(
    public readonly mapName: string,
    private readonly fetch: any,
    private _accessToken: any,
    private datasource: IDatasource
  ) {}

  public async init() {}

  public async requestDirections(route: IRoute, callbacks?: IMapCallbacks) {
    //https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-122.02367%2C47.467621%3B-122.33926%2C47.647813.json?access_token=pk.eyJ1IjoibXlydWJibGUiLCJhIjoiY2pxOXByamFsM2U3azN4cjFqYnp0d2pjaCJ9.4VOlwHd2E9YcVk0J2eKAtw
    if (!route.originCoordinates || !route.destinationCoordinates) {
      return;
    }
    const originPath = `${route.originCoordinates.longitude}%2C${route.originCoordinates.latitude}`;
    const destinationPath = `${route.destinationCoordinates.longitude}%2C${route.destinationCoordinates.latitude}`;
    const accessTokenPath = `access_token=${this._accessToken.mapboxgl.accessToken}`;
    const coordinatesPath = `${originPath}%3B${destinationPath}`;

    const requestUrl = `${this.mapboxApiUrl}/${coordinatesPath}.json?${accessTokenPath}`;
    const response = this.fetch ? await this.fetch(requestUrl) : await window.fetch(requestUrl);
    const directions = await response.json();

    this.handleDirectionsResponse(route, undefined, directions, callbacks);
  }

  private handleDirectionsResponse = (route: IRoute, error: any, data: any, callbacks?: IMapCallbacks) => {
    const directions: IDirections = {
      route: route,
      travelTime: data.routes[0].duration,
      meta: data,
      map: this
    };
    this.saveDirections(directions);
    if (callbacks) {
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
      source: this.mapName,
      createdAt: new Date()
    };

    this.datasource.saveTravelTime(travelTime);
  }
}

export default MapboxMap;
