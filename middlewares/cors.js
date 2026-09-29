const corsMiddleware = require("cors");
const HttpError = require("../error/HttpError");

const allowedOrigins = [
	"http://localhost:3000",
	// add your real frontend URL here later
];

const corsOptions = {
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Request-With",
		"Accept",
	],
	credentials: true,
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new HttpError("Blocked By CORS"));
		}
	},
};

const cors = corsMiddleware(corsOptions);

module.exports = cors;
