import * as cron from "node-cron";
import { updateUsersMonthlyUsage } from "./monthly-usage-checker.js";

export function initializeCronJobs() {
  console.log("Initializing cron jobs...");

  // Schedule the monthly usage checker to run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running monthly usage checker cron job");
    await updateUsersMonthlyUsage();
  });

  updateUsersMonthlyUsage();

  console.log("Cron jobs initialized successfully");
}
