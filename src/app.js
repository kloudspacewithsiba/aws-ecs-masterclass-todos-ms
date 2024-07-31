
// Environment vars
import { config } from "dotenv";
config({ path: "../.env" });

// Packages
import express from "express";

import bodyParser from "body-parser";

import startup from "./startup.js";


// Initialise
const app = express();

// Middleware
app.use(bodyParser.json());


const PORT = process.env.PORT || 5800

// Routes
import todos from "./routes/v1/todos.route.js";
// Paths
app.use(`/api/v1/todos`, todos);

app.listen(PORT, async () => {
  startup.initialise();
});
