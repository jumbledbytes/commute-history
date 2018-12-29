import IDirections from "../../types/idirections";

interface IMapCallbacks {
  onMapLoaded(): void;
  onDirectionsAvailable(error: any, data: IDirections): void;
}

export default IMapCallbacks;
