const Joi = require("joi");

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

const validateLogin = (credentials) => loginSchema.validate(credentials);

module.exports = { validateLogin };
