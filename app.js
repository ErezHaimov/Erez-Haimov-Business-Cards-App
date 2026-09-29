require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectToMongo = require("./config/mongodb/connectToMongo");
const usersRoutes = require("./routes/usersRoutes");
const cardsRoutes = require("./routes/cardsRoutes");
const errorHandler = require("./middlewares/errorHandler");
const fileLogger = require("./middlewares/fileLogger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(":date[iso] :method :url :status :response-time ms"));

// File logger for requests with status >= 400.
// Must be registered before the routes, otherwise the "finish" listener
// never gets attached in time to catch the response.
app.use(fileLogger);

app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

// Must be the last middleware registered
app.use(errorHandler);

const PORT = process.env.PORT || 8181;

connectToMongo().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
