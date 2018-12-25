import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import "./app.css";
import { RouteController } from "./controllers/route-controller";

class App extends Component {
  public render() {
    return <RouteController />;
  }
}

export default App;
