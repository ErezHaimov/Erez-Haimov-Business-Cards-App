require("dotenv").config();
const express = require("express");
const cors = require("./middlewares/cors");
const morgan = require("morgan");

const connectToMongo = require("./config/mongodb/connectToMongo");
const usersRoutes = require("./routes/usersRoutes");
const cardsRoutes = require("./routes/cardsRoutes");
const errorHandler = require("./middlewares/errorHandler");
const fileLogger = require("./middlewares/fileLogger");
const notFound = require("./middlewares/notFound");

const app = express();

app.use(cors);
app.use(express.json());
app.use(morgan(":date[iso] :method :url :status :response-time ms"));
app.use(fileLogger);

app.use("/users", usersRoutes);
app.use("/cards", cardsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8181;

connectToMongo().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
