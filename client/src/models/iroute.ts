import ArangoDocument from "./arango-document";

interface IRoute extends ArangoDocument {
  routeName: string;
  origin: string;
  destination: string;
}

export default IRoute;
