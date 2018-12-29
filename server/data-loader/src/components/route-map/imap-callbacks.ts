import IRoute from "../../../../../common/models/iroute";

interface IMapCallbacks {
  onMapLoaded(): void;
  onDirectionsAvailable(route: IRoute, error: any, data: any): void;
}

export default IMapCallbacks;
