import IRoute from "../../../../common/models/iroute";
import ITravelTime from "../../../../common/models/itravel-time";

interface IDatasource {
  connect(): Promise<boolean>;
  createRoute(newRoute: IRoute): Promise<IRoute | undefined>;
  getRoutes(): Promise<Array<IRoute>>;
  getRoute(routeName: string): Promise<IRoute | undefined>;
  saveRoute(route: IRoute): Promise<boolean>;
  saveTravelTime(travelTime: ITravelTime): Promise<ITravelTime | undefined>;
}

export default IDatasource;
