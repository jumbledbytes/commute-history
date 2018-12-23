import { getCredentials } from "./credentials/get-credentials";

const mapkitJwtFile = "keys/LittleNorthwestFamilyNavigation.json";
const arangoCredentialsFile = "keys/commuter-db-credentials.json";
const mapkitJwt = getCredentials(mapkitJwtFile);
const arangoCredentials = getCredentials(arangoCredentialsFile);

import * as express from "express";

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (request, response) => {
  response.send("Hello world!");
});

app.get("/token", (request, response) => {
  response.send(mapkitJwt);
});

app.get("/credentials", (request, response) => {
  response.send(arangoCredentials);
});

app.listen(5000);
