import React, { Component, SyntheticEvent } from "react";

import { withRouter, RouterChildContext, RouteComponentProps } from "react-router-dom";

import { Tab } from "semantic-ui-react";

import IRoute from "../../../../common/models/iroute";
import TravelTimesController from "../../controllers/travel-times-controller";
import { ApolloClient } from "apollo-boost";
import TravelTimesChart from "../travel-times-chart/travel-times-chart";

interface ICommuteRouteState {
  tabChanged: boolean;
}

interface ICommuteRoutesProps extends RouteComponentProps {
  routes: Array<IRoute>;
  currentRoute?: string;
}

class CommuteRoutes extends Component<ICommuteRoutesProps, ICommuteRouteState> {
  public static defaultProps = {
    routes: [],
    currentRoute: undefined
  };

  private onTabChange = (event: SyntheticEvent, data: any) => {
    const { routes } = this.props;
    this.props.history.push(`/${routes[data.activeIndex].routeName}`);

    TravelTimesChart.chartCounter++;
  };

  public render() {
    const { routes, currentRoute } = this.props;
    let routeIndex = routes.findIndex(route => route.routeName === currentRoute);
    if (routeIndex < 0) {
      routeIndex = 0;
    }
    const tabPanes = routes.map(route => {
      return { menuItem: route.routeName, render: () => <TravelTimesController routeName={route.routeName} /> };
    });
    return (
      <Tab
        style={{ height: "90%" }}
        panes={tabPanes}
        renderActiveOnly={true}
        activeIndex={routeIndex}
        onTabChange={this.onTabChange}
      />
    );
  }
}

export default withRouter(CommuteRoutes);
