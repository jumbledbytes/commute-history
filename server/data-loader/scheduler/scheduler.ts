import * as fs from "fs";
import { exec } from "child_process";

const scheduleJson = fs.readFileSync("./schedule.json");
const config = JSON.parse(scheduleJson.toString());

const loadData = () => {
  console.log(new Date().toString() + ": loading data ");
  exec("yarn load-data");
};

setInterval(loadData, config.schedule.interval * 1000);
