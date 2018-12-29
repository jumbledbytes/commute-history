import IRoute from "../../../../../common/models/iroute";

interface IMap {
  mapName: string;
  map: any;
  init(): void;
  requestDirections(route: IRoute): void;
  handleDirectionsResponse(route: IRoute, error: any, data: any): void;
}

export default IMap;
