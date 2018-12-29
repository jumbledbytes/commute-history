import IArangoDocument from "./arango-document";
import ICoordinates from "./icoordinates";

interface IRoute extends IArangoDocument {
  routeName: string;
  origin: string;
  destination: string;
  originCoordinates?: ICoordinates;
  destinationCoordinates?: ICoordinates;
}

export default IRoute;
