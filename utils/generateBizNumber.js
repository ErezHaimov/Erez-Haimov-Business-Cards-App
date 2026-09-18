const Card = require("../models/Card");

const generateBizNumber = async () => {
	let bizNumber;
	let exists = true;

	while (exists) {
		bizNumber = Math.floor(1000000 + Math.random() * 9000000); // 7 ספרות
		exists = await Card.findOne({ bizNumber });
	}

	return bizNumber;
};

module.exports = generateBizNumber;
