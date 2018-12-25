import IDirectionsRequest from "../types/idirections-request";

declare var mapkit: any;

type RouteAvailableCallback = (error: any, data: any) => any;

class CommuteRoute {
  private directionsRequest: IDirectionsRequest;
  private onRouteAvailable: RouteAvailableCallback;

  constructor(
    private _routeName: string,
    origin: string,
    destination: string,
    onRouteAvailable: RouteAvailableCallback
  ) {
    this.directionsRequest = {
      origin,
      destination,
      transportType: mapkit.Directions.Transport.Automobile,
      requestsAlternateRoutes: false
    };
    this.onRouteAvailable = onRouteAvailable;
    if (_routeName && origin && destination) {
      this.requestRoute();
    }
  }

  public get routeName() {
    return this._routeName;
  }

  public requestRoute() {
    var myDirections = new mapkit.Directions();
    myDirections.route(this.directionsRequest, this.handleDirectionsResponse);
  }

  private handleDirectionsResponse = (error: any, data: any) => {
    if (this.onRouteAvailable) {
      this.onRouteAvailable(error, data);
    }
  };
}

export { CommuteRoute };
