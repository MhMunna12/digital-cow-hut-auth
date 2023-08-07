import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";
process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});
let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string),
      console.log("🛢 Database connection established");
    server = app.listen(config.port, () => {
      console.log(`Application app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed connecting to database", error);
  }
  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();
process.on("SIGTERM", () => {
  console.log("SIGTERM is received");
  if (server) {
    server.close();
  }
});
