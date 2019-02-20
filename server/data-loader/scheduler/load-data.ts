import * as fs from "fs";
import { execSync } from "child_process";
import fetch from "node-fetch";

import ArangoDatasource from "../src/datasources/arango-datasource";
import MapboxMap from "../src/loaders/map/mapbox-map/mapbox-map";

const configLoaderJson = fs.readFileSync("../src/config/data-loader-config.json");
const dataLoaderConfig = JSON.parse(configLoaderJson.toString());

const loadData = () => {
  console.log(new Date().toString() + ": loading data ");
  try {
    switch (dataLoaderConfig.map.source) {
      case "Apple":
        loadAppleData();
        break;
      case "Mapbox":
        loadMapboxData();
        break;
    }
  } catch (e) {
    console.error(`Unable to load data: ${e.message}`);
  }
};

const loadAppleData = () => {
  // Apple maps must be run in browser so we use cypress to run the loader in chrome
  execSync("yarn cypress:run");
};

const loadMapboxData = async () => {
  const datasource = new ArangoDatasource();
  await datasource.connect(fetch);
  const mapTokenUrl = "http://localhost:4000/token/mapbox";
  const response = await fetch(mapTokenUrl);
  const token = await response.json();
  const map = new MapboxMap(MapboxMap.DEFAULT_MAP_NAME, fetch, token, datasource);
  const routes = await datasource.getRoutes();
  routes.forEach(route => {
    console.log(new Date().toString() + ": loading travel times for " + route.routeName);
    try {
      map.requestDirections(route);
    } catch (e) {
      console.error(new Date().toString() + ": Failed to load travel times for " + route.routeName + ": " + e.message);
    }
  });
};

export default loadData;
