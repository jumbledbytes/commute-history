import React, { Component } from "react";

import { ApolloProvider } from "react-apollo";

import "semantic-ui-css/semantic.min.css";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

import "./App.css";
import ApolloDatasource from "./datasources/apollo-datasource";
import RoutesController from "./controllers/routes-controller";

class App extends Component {
  private datasource: ApolloDatasource;

  constructor(props: any) {
    super(props);
    this.datasource = new ApolloDatasource();
  }

  public render() {
    return (
      <ApolloProvider client={this.datasource.client}>
        <RoutesController />
      </ApolloProvider>
    );
  }
}

export default App;
