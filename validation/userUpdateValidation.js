const { userSchema } = require("./userValidation");

// Same rules as registration, but password becomes optional -
// editing a profile shouldn't force the client to resend their password
// every time they just want to change something.
const userUpdateSchema = userSchema.fork(["password"], (schema) =>
	schema.optional(),
);

const validateUserUpdate = (user) => userUpdateSchema.validate(user);

module.exports = { validateUserUpdate };
