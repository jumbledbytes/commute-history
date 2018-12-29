import React, { Component } from "react";

import { Tab } from "semantic-ui-react";

import IRoute from "../../../../common/models/iroute";
import TravelTimesController from "../../controllers/travel-times-controller";

interface ICommuteRoutesProps {
  routes: Array<IRoute>;
}

class CommuteRoutes extends Component<ICommuteRoutesProps> {
  public static defaultProps = {
    routes: []
  };

  public render() {
    const { routes } = this.props;
    const tabPanes = routes.map(route => {
      return { menuItem: route.routeName, render: () => <TravelTimesController routeName={route.routeName} /> };
    });
    return <Tab style={{ height: "90%" }} panes={tabPanes} />;
  }
}

export default CommuteRoutes;
