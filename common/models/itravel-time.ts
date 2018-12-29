import IArangoDocument from "./arango-document";
import IRoute from "./iroute";

interface ITravelTime extends IArangoDocument {
  routeName: string;
  travelTime: number;
  source: string;
  createdAt: Date;
  route?: IRoute;
}

export default ITravelTime;
