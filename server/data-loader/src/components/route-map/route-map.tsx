import React, { Component } from "react";

import "./route-map.css";

declare var mapkit: any;

interface IRouteMapProps {
  accessToken: string;
  routeName: string;
}

class RouteMap extends Component<IRouteMapProps> {
  private map: any;

  constructor(props: IRouteMapProps) {
    super(props);

    this.map = undefined;
  }

  public componentDidMount() {
    const { routeName } = this.props;
    this.map = new mapkit.Map(routeName, { center: new mapkit.Coordinate(37.334883, -122.008977) });
  }

  public render() {
    const { routeName } = this.props;
    return <div id={routeName} className="routeMap" />;
  }
}

export { RouteMap };
