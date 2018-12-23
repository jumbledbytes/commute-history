import IRoute from "../models/iroute";
import ITravelTime from "../models/itravel-time";

interface IDatasource {
  connect(): Promise<boolean>;
  createRoute(newRoute: IRoute): Promise<IRoute | undefined>;
  getRoute(routeName: string): Promise<IRoute | undefined>;
  saveTravelTime(travelTime: ITravelTime): Promise<ITravelTime | undefined>;
}

export default IDatasource;
