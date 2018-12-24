import IRoute from "../../../common/models/iroute";
import ITravelTime from "../../../common/models/itravel-time";

interface IDatasource {
  connect(): Promise<boolean>;
  createRoute(newRoute: IRoute): Promise<IRoute | undefined>;
  getRoute(routeName: string): Promise<IRoute | undefined>;
  saveTravelTime(travelTime: ITravelTime): Promise<ITravelTime | undefined>;
}

export default IDatasource;
