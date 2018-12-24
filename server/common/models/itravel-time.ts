import IArangoDocument from "./arango-document";

interface ITravelTime extends IArangoDocument {
  routeName: string;
  travelTime: number;
  createdAt: Date;
}

export default ITravelTime;
