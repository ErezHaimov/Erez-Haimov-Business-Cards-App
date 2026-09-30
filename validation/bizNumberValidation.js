const Joi = require("joi");

const bizNumberSchema = Joi.object({
	bizNumber: Joi.number().integer().min(1000000).max(9999999).required(),
});

const validateBizNumber = (body) => bizNumberSchema.validate(body);

module.exports = { validateBizNumber };
