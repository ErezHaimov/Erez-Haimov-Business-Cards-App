const fs = require("fs");
const path = require("path");

const fileLogger = (req, res, next) => {
	res.on("finish", () => {
		if (res.statusCode >= 400) {
			const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
			const logsDir = path.join(__dirname, "..", "logs");

			if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

			const logFilePath = path.join(logsDir, `${today}.log`);
			const logLine = `${new Date().toISOString()} | Status: ${res.statusCode} | ${req.method} ${req.originalUrl} | ${res.statusMessage || ""}\n`;

			fs.appendFile(logFilePath, logLine, (err) => {
				if (err) console.error("Failed to write to log file:", err);
			});
		}
	});

	next();
};

module.exports = fileLogger;
