const mongoose = require("mongoose");
const createInitialUsers = require("../../initialData/initialUsers");
const createInitialCards = require("../../initialData/initialCards");

const connectToMongo = async () => {
	const env = process.env.NODE_ENV;
	const uri =
		env === "production"
			? process.env.MONGO_URI_ATLAS
			: process.env.MONGO_URI_LOCAL;

	try {
		await mongoose.connect(uri);
		console.log(
			`Connected to MongoDB (${env || "development"} environment)`,
		);

		await createInitialUsers();
		await createInitialCards();
	} catch (error) {
		console.error("Could not connect to MongoDB:", error.message);
		process.exit(1);
	}
};

module.exports = connectToMongo;
