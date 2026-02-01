import { exec } from "child_process";
import path from "path";

//to create a seed
const DB_NAME = "youtube_clone";
const DUMP_PATH = path.join(process.cwd(), "seed", "dump");

console.log("Starting database seed...");

exec(
  `mongorestore --db ${DB_NAME} --drop ${DUMP_PATH}/${DB_NAME}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error("Seed failed:", error.message);
      return;
    }
    if (stderr) {
      console.error(stderr);
      return;
    }
    console.log("Database seeded successfully");
  }
);
