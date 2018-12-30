import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import CommuteRoutes from "../components/commute-routes/commute-routes";
import ErrorIndicator from "../components/error-indicator/error-indicator";

interface IRoutesControllerProps {
  currentRoute?: string;
}

interface IRoutesControllerState {}

class RoutesController extends Component<IRoutesControllerProps, IRoutesControllerState> {
  constructor(props: IRoutesControllerProps) {
    super(props);
  }

  public render() {
    const { currentRoute } = this.props;
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
          if (!data.routes || !data.routes.length) return <ErrorIndicator message="No routes defined" />;
          return <CommuteRoutes routes={data.routes} currentRoute={currentRoute} />;
        }}
      </Query>
    );
  }
}

export default RoutesController;
