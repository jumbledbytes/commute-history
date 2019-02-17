import React, { Component } from "react";
import { LoadingIndicator } from "../components";
import IRoute from "../../../../common/models/iroute";
import IDatasource from "../datasources/idatasource";
import ArangoDatasource from "../datasources/arango-datasource";
import ITravelTime from "../../../../common/models/itravel-time";
import RouteChooser from "../components/route-chooser/route-chooser";
import MapSource from "../types/map-source";
import IMap from "../loaders/map/imap";
import AppleMap from "../loaders/map/apple-map/apple-map";
import MapboxMap from "../loaders/map/mapbox-map/mapbox-map";
import NullMap from "../loaders/map/null-map/null-map";
import IDirections from "../types/idirections";
import IMapCallbacks from "../loaders/map/imap-callbacks";
import DataLoaderConfig from "../config/data-loader-config.json";

interface IRouteControllerProps {
  mapSource: MapSource;
  tokenUrl: string;
}

interface IRouteControllerState {
  isConnected: boolean;
  isLoading: boolean;
  routes: Array<IRoute>;
}

class RouteController extends Component<IRouteControllerProps, IRouteControllerState> {
  public static defaultProps = {
    mapSource: (MapSource as any)[DataLoaderConfig.map.source],
    tokenUrl: "http://localhost:4000/token"
  };

  private datasource: IDatasource;
  private map: IMap;
  private mapTokenUrl: string;

  private readonly mapCallbacks: IMapCallbacks;

  private get isReady() {
    const { isLoading, isConnected } = this.state;
    return !isLoading && isConnected;
  }

  constructor(props: IRouteControllerProps) {
    super(props);
    this.datasource = new ArangoDatasource();
    this.mapTokenUrl = "";
    switch (props.mapSource) {
      case MapSource.Apple:
        this.mapTokenUrl = `${props.tokenUrl}/apple`;
        break;
      case MapSource.Mapbox:
        this.mapTokenUrl = `${props.tokenUrl}/mapbox`;
        break;
    }
    this.mapCallbacks = {
      onMapLoaded: this.handleMapLoaded,
      onDirectionsAvailable: this.handleDirectionsAvailable
    };
    this.map = new NullMap();
    this.state = {
      isLoading: true,
      isConnected: false,
      routes: []
    };
  }

  public async componentDidMount() {
    await this.connectDatasource();
    this.map = await this.loadMap();
    this.loadRoutes();
  }

  public render() {
    const { routes } = this.state;
    if (!this.isReady) {
      return <LoadingIndicator />;
    }

    return (
      <div className="rootChooser">
        <RouteChooser map={this.map} routes={routes} onRouteChanged={this.handleRouteChanged} />
      </div>
    );
  }

  private async loadMap(): Promise<IMap> {
    const { mapSource } = this.props;
    let newMap: IMap = new NullMap();
    if (!window.fetch || !this.mapTokenUrl) {
      return newMap;
    }
    const response = await window.fetch(this.mapTokenUrl);
    const token = await response.json();

    switch (mapSource) {
      case MapSource.Apple:
        newMap = new AppleMap(AppleMap.DEFAULT_MAP_NAME, token, this.datasource);
        break;
      case MapSource.Mapbox:
        newMap = new MapboxMap(
          MapboxMap.DEFAULT_MAP_NAME,
          undefined /* will default to using window.fetch */,
          token,
          this.datasource
        );
        break;
    }
    await newMap.init();
    return newMap;
  }

  private async connectDatasource() {
    await this.datasource.connect();
    this.setState({ isConnected: true });
  }

  private handleMapLoaded = async () => {
    await this.loadRoutes();
  };

  private async loadRoutes() {
    const { isConnected } = this.state;
    if (!isConnected) {
      return;
    }
    const routes = await this.datasource.getRoutes();
    this.setState({ routes }, () => {
      routes.forEach(route => {
        this.map.requestDirections(route, this.mapCallbacks);
      });
    });

    this.setState({ isLoading: false });
  }

  private handleDirectionsAvailable = async (error: any, data: IDirections) => {
    const routeDocument = await this.datasource.getRoute(data.route.routeName);
    if (!routeDocument) {
      this.datasource.createRoute(data.route);
    }

    const travelTime: ITravelTime = {
      routeName: data.route.routeName,
      travelTime: data.travelTime,
      source: this.map.mapName,
      createdAt: new Date()
    };

    this.datasource.saveTravelTime(travelTime);
  };

  private handleRouteChanged = async (route: IRoute) => {
    const { isConnected } = this.state;
    if (!isConnected) {
      return;
    }

    this.datasource.saveRoute(route);
  };
}

export { RouteController };
