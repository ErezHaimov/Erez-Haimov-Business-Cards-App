const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createInitialUsers = async () => {
	const count = await User.countDocuments();
	if (count > 0) return; // כבר קיימים נתונים - לא כותבים שוב

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash("Aa1234!", salt);

	const users = [
		{
			name: { first: "Regular", middle: "", last: "User" },
			phone: "050-0000001",
			email: "regular@gmail.com",
			password: hashedPassword,
			isBusiness: false,
			isAdmin: false,
			address: {
				country: "israel",
				city: "tel-aviv",
				street: "herzl",
				houseNumber: 1,
			},
		},
		{
			name: { first: "Business", middle: "", last: "User" },
			phone: "050-0000002",
			email: "business@gmail.com",
			password: hashedPassword,
			isBusiness: true,
			isAdmin: false,
			address: {
				country: "israel",
				city: "haifa",
				street: "ben-gurion",
				houseNumber: 2,
			},
		},
		{
			name: { first: "Admin", middle: "", last: "User" },
			phone: "050-0000003",
			email: "admin@gmail.com",
			password: hashedPassword,
			isBusiness: true,
			isAdmin: true,
			address: {
				country: "israel",
				city: "jerusalem",
				street: "jaffa",
				houseNumber: 3,
			},
		},
	];

	await User.insertMany(users);
	console.log("Initial users created");
};

module.exports = createInitialUsers;
