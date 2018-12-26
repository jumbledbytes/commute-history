import React, { Component } from "react";

import { Grid, Header } from "semantic-ui-react";

import ITravelTime from "../../../../common/models/itravel-time";
import TravelTimesChart from "../travel-times-chart/travel-times-chart";

import "./travel-times-viewer.css";

interface ITravelTimesViewerProps {
  travelTimes: Array<ITravelTime>;
}

class TravelTimesViewer extends Component<ITravelTimesViewerProps> {
  public render() {
    const { travelTimes } = this.props;
    const avgReducer = (a: ITravelTime, b: ITravelTime) => {
      return {
        createdAt: now,
        travelTime: a.travelTime + b.travelTime,
        routeName: a.routeName
      };
    };
    const now = new Date();
    const sortedDates = travelTimes.sort((a, b) => (a.createdAt > b.createdAt ? 1 : 0));
    const last5Minutes = travelTimes.filter(travelTime => travelTime.createdAt.getTime() >= now.getTime() - 300 * 1000);
    const last10Minutes = travelTimes.filter(
      travelTime => travelTime.createdAt.getTime() >= now.getTime() - 600 * 1000
    );
    const last15Minutes = travelTimes.filter(
      travelTime => travelTime.createdAt.getTime() >= now.getTime() - 900 * 1000
    );
    const avg5Mins = last5Minutes.length > 0 ? last5Minutes.reduce(avgReducer).travelTime / last5Minutes.length : "N/A";
    const avg10Mins =
      last10Minutes.length > 0 ? last10Minutes.reduce(avgReducer).travelTime / last10Minutes.length : "N/A";
    const avg15Mins =
      last15Minutes.length > 0 ? last15Minutes.reduce(avgReducer).travelTime / last15Minutes.length : "N/A";

    return (
      <div>
        <div className="travelTimesGrid">
          <Grid columns="equal">
            <Grid.Column>
              <Header as="h3">Latest: {Math.round(sortedDates[0].travelTime / 60)}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">5 mins avg: {avg5Mins}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">10 mins avg: {avg10Mins}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">15 mins avg: {avg15Mins}</Header>
            </Grid.Column>
          </Grid>
        </div>
        <TravelTimesChart travelTimes={travelTimes} />
      </div>
    );
  }
}

export default TravelTimesViewer;
