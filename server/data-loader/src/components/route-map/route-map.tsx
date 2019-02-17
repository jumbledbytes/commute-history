import React, { Component } from "react";

import "./route-map.css";
import IRoute from "../../../../../common/models/iroute";
import IMap from "../../loaders/map/imap";

declare var mapkit: any;

interface IRouteMapProps {
  map: IMap;
  route: IRoute;
}

class RouteMap extends Component<IRouteMapProps> {
  constructor(props: IRouteMapProps) {
    super(props);
  }

  public render() {
    const { route, map } = this.props;
    return <div id={route.routeName} className={map.mapName} />;
  }
}

export { RouteMap };
