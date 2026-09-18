const Card = require("../models/Card");
const User = require("../models/User");

const createInitialCards = async () => {
	const count = await Card.countDocuments();
	if (count > 0) return; // cards already exist - don't create duplicates

	const businessUser = await User.findOne({ email: "business@gmail.com" });
	const adminUser = await User.findOne({ email: "admin@gmail.com" });

	const cards = [
		{
			title: "Delicious Pizza",
			subtitle: "Best pizza in town",
			description: "Fresh ingredients, wood-fired oven, delivered hot.",
			phone: "050-1111111",
			email: "pizza@gmail.com",
			web: "https://www.pizza.co.il",
			bizNumber: 1000001,
			user_id: businessUser._id,
			address: {
				country: "israel",
				city: "tel-aviv",
				street: "dizengoff",
				houseNumber: 10,
			},
		},
		{
			title: "Clean Cars Garage",
			subtitle: "Car repair & maintenance",
			description: "20 years of experience fixing all car brands.",
			phone: "050-2222222",
			email: "garage@gmail.com",
			web: "https://www.cleancars.co.il",
			bizNumber: 1000002,
			user_id: businessUser._id,
			address: {
				country: "israel",
				city: "haifa",
				street: "hanassi",
				houseNumber: 20,
			},
		},
		{
			title: "Admin Consulting",
			subtitle: "Business consulting services",
			description: "Helping businesses grow since 2010.",
			phone: "050-3333333",
			email: "consulting@gmail.com",
			web: "https://www.consulting.co.il",
			bizNumber: 1000003,
			user_id: adminUser._id,
			address: {
				country: "israel",
				city: "jerusalem",
				street: "king-george",
				houseNumber: 30,
			},
		},
	];

	await Card.insertMany(cards);
	console.log("Initial cards created");
};

module.exports = createInitialCards;
