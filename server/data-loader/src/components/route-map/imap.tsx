import IRoute from "../../../../../common/models/iroute";
import IDirections from "../../types/idirections";

interface IMap {
  mapName: string;
  map: any;
  init(): void;
  requestDirections(route: IRoute): void;
  handleDirectionsResponse(route: IRoute, error: any, data: IDirections): void;
}

export default IMap;
