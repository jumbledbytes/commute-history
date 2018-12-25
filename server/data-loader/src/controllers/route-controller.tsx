import React, { Component } from "react";
import { LoadingIndicator } from "../components";
import { RouteMap } from "../components";
import IRoute from "../../../../common/models/iroute";
import { CommuteRoute } from "../routes";
import IDatasource from "../datasources/idatasource";
import ArangoDatasource from "../datasources/arango-datasource";
import ITravelTime from "../../../../common/models/itravel-time";
import RouteChooser from "../components/route-chooser/route-chooser";

declare var mapkit: any;

interface IRouteControllerProps {
  tokenUrl: string;
}

interface IRouteControllerState {
  isConnected: boolean;
  isLoading: boolean;
  accessToken: string;
  routes: Array<IRoute>;
}

class RouteController extends Component<IRouteControllerProps, IRouteControllerState> {
  public static defaultProps = {
    tokenUrl: "http://localhost:4000/token"
  };

  private commuteRoutes: Array<CommuteRoute>;
  private datasource: IDatasource;

  private get isReady() {
    const { isLoading, isConnected } = this.state;
    return !isLoading && isConnected;
  }

  constructor(props: IRouteControllerProps) {
    super(props);
    this.datasource = new ArangoDatasource();
    this.commuteRoutes = [];
    this.state = {
      isLoading: true,
      isConnected: false,
      accessToken: "",
      routes: []
    };
  }

  public async componentDidMount() {
    this.loadAccessToken();
    await this.connectDatasource();
    this.loadRoutes();
  }

  public render() {
    const { accessToken, routes } = this.state;
    if (!this.isReady) {
      return <LoadingIndicator />;
    }

    return (
      <div className="rootChooser">
        <RouteChooser
          accessToken={accessToken}
          routes={routes}
          routeHandlers={this.commuteRoutes}
          onRouteChanged={this.handleRouteChanged}
        />
      </div>
    );
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
        const commuteRoute = new CommuteRoute(
          route.routeName,
          route.origin,
          route.destination,
          (error: any, data: any) => {
            this.handleRouteAvailable(route, error, data);
          }
        );
        commuteRoute.requestRoute();
        this.commuteRoutes.push(commuteRoute);
        this.setState({ isLoading: false });
      });
    });
  }

  private handleRouteAvailable = async (route: IRoute, error: any, data: any) => {
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
