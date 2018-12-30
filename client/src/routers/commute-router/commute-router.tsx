import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, RouteComponentProps } from "react-router-dom";
import RoutesController from "../../controllers/routes-controller";

interface ICommuteRouterProps {
  routeName: string;
}

type RenderProps = RouteComponentProps<ICommuteRouterProps>;

class CommuteRouter extends Component {
  private renderRoute = (props: RenderProps) => {
    const { routeName } = props.match.params;
    return <RoutesController currentRoute={routeName} />;
  };

  public render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/:routeName"
            render={(props: RenderProps) => {
              return this.renderRoute(props);
            }}
          />
        </Switch>
      </Router>
    );
  }
}

export default CommuteRouter;
