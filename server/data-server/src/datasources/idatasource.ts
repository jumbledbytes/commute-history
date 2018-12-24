import IRoute from "../../../common/models/iroute";
import ITravelTime from "../../../common/models/itravel-time";

interface IDatasource {
  connect(): Promise<boolean>;
  getRoutes(): Promise<Array<IRoute>>;
  getRoute(routeName: string): Promise<IRoute | undefined>;
  getTravelTimes(routeName: string): Promise<Array<ITravelTime>>;
}

export default IDatasource;
