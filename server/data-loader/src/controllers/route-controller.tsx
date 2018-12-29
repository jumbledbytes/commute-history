import React, { Component } from "react";
import { LoadingIndicator } from "../components";
import IRoute from "../../../../common/models/iroute";
import IDatasource from "../datasources/idatasource";
import ArangoDatasource from "../datasources/arango-datasource";
import ITravelTime from "../../../../common/models/itravel-time";
import RouteChooser from "../components/route-chooser/route-chooser";
import MapSource from "../types/map-source";
import IMap from "../components/route-map/imap";
import AppleMap from "../components/route-map/apple-map/apple-map";
import MapboxMap from "../components/route-map/mapbox-map/mapbox-map";
import NullMap from "../components/route-map/null-map/null-map";

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
    mapSource: MapSource.Apple,
    tokenUrl: "http://localhost:4000/token"
  };

  private datasource: IDatasource;
  private map: IMap;
  private mapTokenUrl: string;

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
    this.map = new NullMap();
    this.state = {
      isLoading: true,
      isConnected: false,
      routes: []
    };
  }

  public async componentDidMount() {
    this.map = await this.loadMap();
    await this.connectDatasource();
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
    const mapCallbacks = {
      onMapLoaded: this.handleMapLoaded,
      onDirectionsAvailable: this.handleDirectionsAvailable
    };

    switch (mapSource) {
      case MapSource.Apple:
        newMap = new AppleMap(AppleMap.DEFAULT_MAP_NAME, token, mapCallbacks);
        break;
      case MapSource.Mapbox:
        newMap = new MapboxMap(MapboxMap.DEFAULT_MAP_NAME, token, mapCallbacks);
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
        this.map.requestDirections(route);
      });
    });

    this.setState({ isLoading: false });
  }

  private handleDirectionsAvailable = async (route: IRoute, error: any, data: any) => {
    console.log(data);
    const routeDocument = await this.datasource.getRoute(route.routeName);
    if (!routeDocument) {
      const newRoute: IRoute = {
        routeName: route.routeName,
        origin: route.origin,
        destination: route.destination
      };
      this.datasource.createRoute(newRoute);
    }

    const travelTime: ITravelTime = {
      routeName: route.routeName,
      travelTime: data.routes[0].expectedTravelTime,
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
