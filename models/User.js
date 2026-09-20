const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		first: { type: String, required: true, minlength: 2, maxlength: 256 },
		middle: {
			type: String,
			maxlength: 256,
			default: "",
			validate: {
				validator: (v) => v === "" || v.length >= 2,
				message:
					"name.middle must be empty or at least 2 characters long",
			},
		},
		last: { type: String, required: true, minlength: 2, maxlength: 256 },
	},
	phone: { type: String, required: true },
	email: { type: String, required: true, unique: true, lowercase: true },
	password: { type: String, required: true },
	image: {
		url: { type: String, default: "" },
		alt: { type: String, default: "" },
	},
	address: {
		state: { type: String, default: "" },
		country: { type: String, required: true },
		city: { type: String, required: true },
		street: { type: String, required: true },
		houseNumber: { type: mongoose.Schema.Types.Mixed, required: true },
		zip: { type: mongoose.Schema.Types.Mixed, default: 0 },
	},
	isAdmin: { type: Boolean, default: false },
	isBusiness: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
