const Joi = require("joi");

const userSchema = Joi.object({
	name: Joi.object({
		first: Joi.string().min(2).max(256).required(),
		middle: Joi.string().min(2).max(256).allow(""),
		last: Joi.string().min(2).max(256).required(),
	}).required(),
	isBusiness: Joi.boolean().required(),
	phone: Joi.string()
		.pattern(/^0[2-9]\d{1,2}-?\d{7}$/)
		.required(),
	email: Joi.string().email().required(),
	password: Joi.string()
		.pattern(
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{7,}$/,
		)
		.required()
		.messages({
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one lowercase letter, one number and one special character, and be at least 7 characters long",
		}),
	address: Joi.object({
		state: Joi.string().allow(""),
		country: Joi.string().required(),
		city: Joi.string().required(),
		street: Joi.string().required(),
		houseNumber: Joi.alternatives(Joi.string(), Joi.number()).required(),
		zip: Joi.alternatives(Joi.string(), Joi.number()).allow(""),
	}).required(),
	image: Joi.object({
		url: Joi.string().allow(""),
		alt: Joi.string().allow(""),
	}),
});

const validateUser = (user) => userSchema.validate(user);

module.exports = { userSchema, validateUser };
