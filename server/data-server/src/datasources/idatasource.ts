import ITravelTime from "../../../../common/models/itravel-time";
import IRoute from "../../../../common/models/iroute";

interface IDatasource {
  connect(): Promise<boolean>;
  getRoutes(): Promise<Array<IRoute>>;
  getRoute(routeName: string): Promise<IRoute | undefined>;
  getTravelTimes(routeName: string): Promise<Array<ITravelTime>>;
}

export default IDatasource;
