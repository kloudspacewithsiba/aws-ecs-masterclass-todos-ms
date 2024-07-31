import log4js from "log4js";
import fs from "fs";

log4js.configure({
  appenders: {
    stdout: { type: "stdout" },
    file: { type: "file", filename: "logs/out.log" },
  },
  categories: {
    default: { appenders: ["stdout", "file"], level: "info" },
  },
});
export const logger = log4js.getLogger();

export const readLog = () => {
  let log = fs.readFileSync("logs/out.log", "utf8", (error, content) => {
    if (error) {
      log4js.getLogger().error(error);
      return error;
    }
    return content;
  });
  return log;
};

export const writeLog = (result) => {
  const today = new Date();
  const now = today.toTimeString().substring(0, 8);
  logger.info(`Time requested at ${now}`);
  logger.info(result);
};
