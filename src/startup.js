import * as Logger from "./utils/logger.js";

const initialise = async () => {
  try {
    Logger.writeLog(`Server is up and running!`);
  } catch (error) {
    Logger.writeLog(error && error.message ? error.message : "Unknown error.");
  }
};

export default { initialise };
