import IRoute from "../../../../../common/models/iroute";
import IMapCallbacks from "./imap-callbacks";

interface IMap {
  mapName: string;
  map: any;
  init(): void;
  requestDirections(route: IRoute, callbacks?: IMapCallbacks): void;
}

export default IMap;
