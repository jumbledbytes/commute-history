import ArangoDocument from "./arango-document";

interface ITravelTime extends ArangoDocument {
  routeName: string;
  travelTime: number;
  createdAt: Date;
}

export default ITravelTime;
