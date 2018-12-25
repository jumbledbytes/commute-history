import React, { Component } from "react";
import { Tab } from "semantic-ui-react";

import IRoute from "../../../../../common/models/iroute";
import RouteViewer from "../route-viewer/route-viewer";
import { CommuteRoute } from "../../routes";

interface IRouteChooserProps {
  accessToken: string;
  routes: Array<IRoute>;
  routeHandlers: Array<CommuteRoute>;
  onRouteChanged(route: IRoute): void;
}

class RouteChooser extends Component<IRouteChooserProps> {
  public static defaultProps = {
    routes: [],
    routeHandlers: [],
    onRouteChanged: () => undefined
  };

  public render() {
    const { accessToken, onRouteChanged, routes, routeHandlers } = this.props;

    const tabPanes: Array<any> = [];
    routes.forEach((route, index) => {
      const routeHandler = routeHandlers[index];
      const pane = {
        menuItem: route.routeName,
        render: () => (
          <RouteViewer
            accessToken={accessToken}
            route={route}
            routeHandler={routeHandler}
            onRouteChanged={onRouteChanged}
          />
        )
      };
      tabPanes.push(pane);
    });
    const newRoute: IRoute = {
      routeName: "",
      origin: "",
      destination: ""
    };
    const newRoutePane = {
      menuItem: "Add Route",
      render: () => (
        <RouteViewer
          accessToken={accessToken}
          route={newRoute}
          routeHandler={new CommuteRoute("", "", "", () => undefined)}
          onRouteChanged={onRouteChanged}
        />
      )
    };
    tabPanes.push(newRoutePane);
    return <Tab panes={tabPanes} />;
  }
}

export default RouteChooser;
