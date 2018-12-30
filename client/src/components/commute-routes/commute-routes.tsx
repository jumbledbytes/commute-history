import React, { Component } from "react";

import { Tab } from "semantic-ui-react";

import IRoute from "../../../../common/models/iroute";
import TravelTimesController from "../../controllers/travel-times-controller";

interface ICommuteRoutesProps {
  routes: Array<IRoute>;
  currentRoute?: string;
}

class CommuteRoutes extends Component<ICommuteRoutesProps> {
  public static defaultProps = {
    routes: []
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
    return <Tab style={{ height: "90%" }} panes={tabPanes} renderActiveOnly={true} activeIndex={routeIndex} />;
  }
}

export default CommuteRoutes;
