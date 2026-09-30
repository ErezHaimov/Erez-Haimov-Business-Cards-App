const { userSchema } = require("./userValidation");

const userUpdateSchema = userSchema.fork(["password"], (schema) =>
	schema.optional(),
);

const validateUserUpdate = (user) => userUpdateSchema.validate(user);

module.exports = { validateUserUpdate };
