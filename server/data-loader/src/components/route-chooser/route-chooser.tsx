import React, { Component } from "react";
import { Tab } from "semantic-ui-react";

import IRoute from "../../../../../common/models/iroute";
import RouteViewer from "../route-viewer/route-viewer";
import IMap from "../../loaders/map/imap";

interface IRouteChooserProps {
  map: IMap;
  routes: Array<IRoute>;
  onRouteChanged(route: IRoute): void;
}

class RouteChooser extends Component<IRouteChooserProps> {
  public static defaultProps = {
    routes: [],
    onRouteChanged: () => undefined
  };

  public render() {
    const { map, onRouteChanged, routes } = this.props;

    const tabPanes: Array<any> = [];
    routes.forEach((route, index) => {
      const pane = {
        menuItem: route.routeName,
        render: () => <RouteViewer map={map} route={route} onRouteChanged={onRouteChanged} />
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
      render: () => <RouteViewer map={map} route={newRoute} onRouteChanged={onRouteChanged} />
    };
    tabPanes.push(newRoutePane);
    return <Tab panes={tabPanes} />;
  }
}

export default RouteChooser;
