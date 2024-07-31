import express from "express";
import * as Logger from "../../controllers/logs.controller.js";
const route = express.Router();

route.get("/logs", Logger.getLogs);

export default route;
