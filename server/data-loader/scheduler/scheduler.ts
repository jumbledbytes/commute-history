import * as fs from "fs";

import loadData from "./load-data";

const scheduleJson = fs.readFileSync("./schedule.json");
const config = JSON.parse(scheduleJson.toString());

loadData();
setInterval(loadData, config.schedule.interval * 1000);
