import * as fs from "fs";
import { execSync } from "child_process";

const scheduleJson = fs.readFileSync("./schedule.json");
const config = JSON.parse(scheduleJson.toString());

const loadData = () => {
  console.log(new Date().toString() + ": loading data ");
  try {
    execSync("yarn load-data");
  } catch (e) {
    console.error(`Unable to load data: ${e.message}`);
  }
};

loadData();
setInterval(loadData, config.schedule.interval * 1000);
