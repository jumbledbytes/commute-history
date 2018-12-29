import React, { Component, ChangeEvent } from "react";

import { Label, Input, List, Button } from "semantic-ui-react";

import IRoute from "../../../../../common/models/iroute";
import { RouteMap } from "../route-map/route-map";
import { CommuteRoute } from "../../routes";
import IMap from "../route-map/imap";

interface IRouteViewerProps {
  map: IMap;
  route: IRoute;
  onRouteChanged(route: IRoute): void;
}

class RouteViewer extends Component<IRouteViewerProps> {
  public static defaultProps = {
    onRouteChanged: () => undefined
  };

  public render() {
    const { map, route } = this.props;
    return (
      <div>
        {this.renderRouteDetails()}
        <RouteMap map={map} route={route} />
      </div>
    );
  }

  private renderRouteDetails() {
    const { route } = this.props;
    const isSaved = !!route._key;
    const hasRouteName = !!route.routeName;

    return (
      <List>
        <List.Item>
          <List.Header>Route Name</List.Header>
          <List.Content>
            <Input defaultValue={route.routeName} />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Origin</List.Header>
          <List.Content>
            <Input
              disabled={!hasRouteName}
              defaultValue={route.origin}
              onChange={(event: ChangeEvent, data: any) => this.handleOriginChange(route, data.value)}
            />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Header>Destination</List.Header>
          <List.Content>
            <Input
              disabled={!hasRouteName}
              defaultValue={route.destination}
              onChange={(event: ChangeEvent, data: any) => this.handleDestinationChange(route, data.value)}
            />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            {isSaved && (
              <Button primary onClick={this.handleUpdateTravelTime}>
                Calculate Current Travel Time
              </Button>
            )}
            {!isSaved && <Button primary>Add Route (not supported yet)</Button>}
          </List.Content>
        </List.Item>
      </List>
    );
  }

  private handleUpdateTravelTime = async () => {
    const { map, route } = this.props;
    map.requestDirections(route);
  };

  private handleOriginChange = async (route: IRoute, newOrigin: string) => {
    const { onRouteChanged } = this.props;
    if (newOrigin !== route.origin) {
      const newRoute = { ...route };
      newRoute.origin = newOrigin;
      onRouteChanged(newRoute);
    }
  };

  private handleDestinationChange = async (route: IRoute, newDestination: string) => {
    const { onRouteChanged } = this.props;
    if (newDestination !== route.origin) {
      const newRoute = { ...route };
      newRoute.destination = newDestination;
      onRouteChanged(newRoute);
    }
  };

  private handleSaveNewRoute = async (route: IRoute) => {
    const { onRouteChanged } = this.props;
    onRouteChanged(route);
  };
}

export default RouteViewer;
