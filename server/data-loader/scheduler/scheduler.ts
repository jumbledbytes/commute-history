import * as fs from "fs";
import { execSync } from "child_process";

const scheduleJson = fs.readFileSync("./schedule.json");
const config = JSON.parse(scheduleJson.toString());

const loadData = () => {
  console.log(new Date().toString() + ": loading data ");
  const output = execSync("yarn load-data");
  console.log(`   ${output}`);
};

loadData();
setInterval(loadData, config.schedule.interval * 1000);
