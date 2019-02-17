import IRoute from "../../../../common/models/iroute";
import IMap from "../loaders/map/imap";

interface IDirections {
  route: IRoute;
  travelTime: number;
  meta: any;
  map: IMap;
}

export default IDirections;
