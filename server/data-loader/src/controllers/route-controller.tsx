import React, { Component } from "react";
import { LoadingIndicator } from "../components";
import { RouteMap } from "../components";
import IRoute from "../../../../common/models/iroute";
import { CommuteRoute } from "../routes";
import IDatasource from "../datasources/idatasource";
import ArangoDatasource from "../datasources/arango-datasource";
import ITravelTime from "../../../../common/models/itravel-time";

declare var mapkit: any;

interface IRouteControllerProps {
  tokenUrl: string;
}

interface IRouteControllerState {
  isConnected: boolean;
  isLoading: boolean;
  accessToken: string;
  route: IRoute;
}

class RouteController extends Component<IRouteControllerProps, IRouteControllerState> {
  public static defaultProps = {
    tokenUrl: "http://localhost:5000/token"
  };

  private commuteRoute: CommuteRoute | undefined = undefined;
  private datasource: IDatasource;

  private get isReady() {
    const { isLoading, isConnected } = this.state;
    return !isLoading && isConnected;
  }

  constructor(props: IRouteControllerProps) {
    super(props);
    this.datasource = new ArangoDatasource();
    this.state = {
      isLoading: true,
      isConnected: false,
      accessToken: "",
      route: { routeName: "defaultRoute", origin: "Seattle, WA", destination: "Tacoma, WA" }
    };
  }

  public async componentDidMount() {
    this.loadAccessToken();
    await this.connectDatasource();
  }

  public render() {
    const { accessToken } = this.state;
    if (!this.isReady) {
      return <LoadingIndicator />;
    }

    return <RouteMap accessToken={accessToken} routeName="defaultRoute" />;
  }

  private async loadAccessToken() {
    const { tokenUrl } = this.props;
    if (!window.fetch || !tokenUrl) {
      return;
    }
    const response = await window.fetch(tokenUrl);
    const token = await response.json();

    mapkit.init({
      authorizationCallback: (done: (value: string) => undefined) => {
        done(token.token);
        this.handleMapLoaded();
      }
    });

    this.setState({ accessToken: token.token });
  }

  private async connectDatasource() {
    await this.datasource.connect();
    this.setState({ isConnected: true });
  }

  private handleMapLoaded = () => {
    const { route } = this.state;
    this.commuteRoute = new CommuteRoute(route.routeName, route.origin, route.destination, this.handleRouteAvailable);
    this.setState({ isLoading: false });
  };

  private handleRouteAvailable = async (error: any, data: any) => {
    console.log(data);
    const { route } = this.state;
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
}

export { RouteController };
