const Joi = require("joi");

const cardSchema = Joi.object({
	title: Joi.string().required(),
	subtitle: Joi.string().required(),
	description: Joi.string().required(),
	phone: Joi.string()
		.pattern(/^0[2-9]\d{1,2}-?\d{7}$/)
		.required(),
	email: Joi.string().email().required(),
	web: Joi.string().allow(""),
	image: Joi.object({
		url: Joi.string().allow(""),
		alt: Joi.string().allow(""),
	}),
	address: Joi.object({
		state: Joi.string().allow(""),
		country: Joi.string().required(),
		city: Joi.string().required(),
		street: Joi.string().required(),
		houseNumber: Joi.alternatives(Joi.string(), Joi.number()).required(),
		zip: Joi.alternatives(Joi.string(), Joi.number()).allow(""),
	}).required(),
});

const validateCard = (card) => cardSchema.validate(card);

module.exports = { validateCard };
