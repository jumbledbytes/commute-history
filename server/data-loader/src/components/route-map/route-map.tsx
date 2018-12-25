import React, { Component } from "react";

import "./route-map.css";
import IRoute from "../../../../../common/models/iroute";

declare var mapkit: any;

interface IRouteMapProps {
  accessToken: string;
  route: IRoute;
}

class RouteMap extends Component<IRouteMapProps> {
  private map: any;

  constructor(props: IRouteMapProps) {
    super(props);

    this.map = undefined;
  }

  public componentDidMount() {
    const { route } = this.props;
    this.map = new mapkit.Map(route.routeName, { center: new mapkit.Coordinate(37.334883, -122.008977) });
  }

  public render() {
    const { route } = this.props;
    return <div id={route.routeName} className="routeMap" />;
  }
}

export { RouteMap };
