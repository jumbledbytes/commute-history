import React, { Component } from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { LoadingIndicator } from "../components/loading-indicator/loading-indicator";
import IRoute from "../../../common/models/iroute";
import TravelTimesViewer from "../components/travel-times-viewer/travel-times-viewer";
import moment from "moment";
import ITravelTime from "../../../common/models/itravel-time";

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
    routeName: ""
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
          const convertedTravelTimes = data.travelTimes.map((travelTime: ITravelTime) => {
            return {
              ...travelTime,
              createdAt: moment(travelTime.createdAt).toDate()
            };
          });
          return <TravelTimesViewer travelTimes={convertedTravelTimes} />;
        }}
      </Query>
    );
  }
}

export default TravelTimesController;
