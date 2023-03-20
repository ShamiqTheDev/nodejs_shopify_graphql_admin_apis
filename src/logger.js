let winston = require("winston");

const logger = (params) => {
    const { subFolder, filePrefix } = params;

    const loggingDate = new Date().toISOString().slice(0, 10);
    const loggerConfig = {
        transports: [
            new winston.transports.File({
                filename: `logs/${subFolder}/${filePrefix}-${loggingDate}.log`
            })
        ],
    };
    const logger = winston.createLogger(loggerConfig);// initializing logger

    return logger;
}


module.exports = logger;
