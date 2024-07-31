import * as Logger from "../utils/logger.js";

export const getLogs = async (req, res) => {
  try {
    const result = Logger.readLog();
    res.set("Content-Type", "text/plain");
    return res.send(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};
