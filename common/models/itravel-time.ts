import IArangoDocument from "./arango-document";

interface ITravelTime extends IArangoDocument {
  routeName: string;
  travelTime: number;
  source: string;
  createdAt: Date;
}

export default ITravelTime;
