import express from "express";
import connectDB from "./DB/dbConnection.js";
import schedule from "node-schedule";
import { config } from "dotenv";
import init from "./src/modules/server.routes.js";

config({ path: "./config/dev.config.env" });

const app = express();
// DB Connection
await connectDB();

app.use(express.json());

// API routes
init(app);

// Page Not Found
app.all("*", (req, res, next) => {
  return next(new Error(`Invalid req on ${req.originalUrl}`, { cause: 404 }));
});

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`); //port can be string or number
});
