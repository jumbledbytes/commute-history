import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import CommuteRoutes from "../components/commute-routes/commute-routes";
import ErrorIndicator from "../components/error-indicator/error-indicator";

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
          if (error) return <ErrorIndicator message={error.message} />;

          return <CommuteRoutes routes={data.routes} />;
        }}
      </Query>
    );
  }
}

export default RoutesController;
