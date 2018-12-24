import IArangoDocument from "./arango-document";

interface IRoute extends IArangoDocument {
  routeName: string;
  origin: string;
  destination: string;
}

export default IRoute;
