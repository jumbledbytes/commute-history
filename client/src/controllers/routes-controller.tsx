import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import CommuteRoutes from "../components/commute-routes/commute-routes";

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

          return <CommuteRoutes routes={data.routes} />;
        }}
      </Query>
    );
  }
}

export default RoutesController;
