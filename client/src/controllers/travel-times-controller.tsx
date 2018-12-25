import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import IRoute from "../../../common/models/iroute";
import ITravelTime from "../../../common/models/itravel-time";
import TravelTimesChart from "../components/travel-times-chart/travel-times-chart";

interface ITravelTimesControllerProps {
  routeName: string;
}

interface ITravelTimesControllerState {
  isConnected: boolean;
  isLoading: boolean;
  routes: Array<IRoute>;
}

class TravelTimesController extends Component<ITravelTimesControllerProps, ITravelTimesControllerState> {
  public static defaultProps = {
    routeName: "defaultRoute"
  };

  constructor(props: ITravelTimesControllerProps) {
    super(props);
  }

  public render() {
    const { routeName } = this.props;
    return (
      <Query
        query={gql`
          {
            travelTimes(routeName: "${routeName}") {
              route {
                routeName
              },
              createdAt,
              travelTime
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <LoadingIndicator />;
          if (error) return <p>Error :(</p>;

          return <TravelTimesChart travelTimes={data.travelTimes} />;
        }}
      </Query>
    );
  }
}

export default TravelTimesController;
