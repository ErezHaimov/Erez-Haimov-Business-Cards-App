const jwt = require("jsonwebtoken");

const generateToken = (user) => {
	const payload = {
		_id: user._id,
		isBusiness: user.isBusiness,
		isAdmin: user.isAdmin,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = generateToken;
