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
        source: a.source,
        routeName: a.routeName
      };
    };
    const now = new Date();
    const sortedDates = travelTimes.sort((a, b) => (a.createdAt > b.createdAt ? 1 : 0));
    if (sortedDates.length === 0) {
      sortedDates.push({
        createdAt: now,
        travelTime: 0,
        source: "",
        routeName: ""
      });
    }
    const routeName = sortedDates[0].routeName;
    const last10Minutes = travelTimes.filter(
      travelTime => travelTime.createdAt.getTime() >= now.getTime() - 600 * 1000
    );
    const last20Minutes = travelTimes.filter(
      travelTime => travelTime.createdAt.getTime() >= now.getTime() - 1200 * 1000
    );
    const last30Minutes = travelTimes.filter(
      travelTime => travelTime.createdAt.getTime() >= now.getTime() - 1800 * 1000
    );
    const avg10Mins = last10Minutes.length > 0 ? last10Minutes.reduce(avgReducer).travelTime / last10Minutes.length : 0;
    const avg20Mins = last20Minutes.length > 0 ? last20Minutes.reduce(avgReducer).travelTime / last20Minutes.length : 0;
    const avg30Mins = last30Minutes.length > 0 ? last30Minutes.reduce(avgReducer).travelTime / last30Minutes.length : 0;

    return (
      <div style={{ height: "100%" }}>
        <div className="travelTimesGrid">
          <Grid columns="equal">
            <Grid.Column>
              <Header as="h3">Latest: {Math.round(sortedDates[0].travelTime / 60)}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">10 mins avg: {Math.round(avg10Mins / 60)}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">20 mins avg: {Math.round(avg20Mins / 60)}</Header>
            </Grid.Column>

            <Grid.Column>
              <Header as="h3">30 mins avg: {Math.round(avg30Mins / 60)}</Header>
            </Grid.Column>
          </Grid>
        </div>
        <TravelTimesChart routeName={routeName} travelTimes={sortedDates} />
      </div>
    );
  }
}

export default TravelTimesViewer;
