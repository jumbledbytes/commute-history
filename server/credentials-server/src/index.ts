import { getCredentials } from "./credentials/get-credentials";

import * as express from "express";
import { exec } from "child_process";

const mapkitJwtFile = "keys/LittleNorthwestFamilyNavigation.json";
const arangoCredentialsFile = "keys/commuter-db-credentials.json";
let mapkitJwt = getCredentials(mapkitJwtFile);
const arangoCredentials = getCredentials(arangoCredentialsFile);

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (request, response) => {
  response.send("Credentials Server");
});

app.get("/token", async (request, response) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const makkitJwtJson = JSON.parse(mapkitJwt);
  if (makkitJwtJson.expireAt < currentTime - 5) {
    await exec("yarn generate-token");
    mapkitJwt = getCredentials(mapkitJwtFile);
  }
  response.send(mapkitJwt);
});

app.get("/credentials", (request, response) => {
  response.send(arangoCredentials);
});

app.listen(4000);
