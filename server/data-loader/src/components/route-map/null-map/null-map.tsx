import IMap from "../imap";
import IRoute from "../../../../../../common/models/iroute";

class NullMap implements IMap {
  constructor(public readonly mapName: string = "", public readonly map: any = undefined) {}
  init(): void {
    throw new Error("Method not implemented.");
  }
  requestDirections(request: IRoute): void {
    throw new Error("Method not implemented.");
  }
  handleDirectionsResponse(error: any, data: any): void {
    throw new Error("Method not implemented.");
  }
}

export default NullMap;
