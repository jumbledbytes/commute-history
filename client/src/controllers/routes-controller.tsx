import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import IRoute from "../../../common/models/iroute";

interface IRoutesControllerProps {}

interface IRoutesControllerState {}

class RoutesController extends Component<IRoutesControllerProps, IRoutesControllerState> {
  constructor(props: IRoutesControllerProps) {
    super(props);
  }

  public render() {
    return (
      <Query
        query={gql`
          {
            routes {
              routeName
              origin
              destination
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <LoadingIndicator />;
          if (error) return <p>Error :(</p>;

          return data.routes.map((route: IRoute) => (
            <div key={route.routeName}>
              <p>{`${route.origin}: ${route.destination}`}</p>
            </div>
          ));
        }}
      </Query>
    );
  }
}

export default RoutesController;
