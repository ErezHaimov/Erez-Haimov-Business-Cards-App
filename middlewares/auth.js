const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token)
		return res.status(401).send("Access denied. No token provided.");

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).send("Invalid token.");
	}
};

const isAdmin = (req, res, next) => {
	if (!req.user?.isAdmin)
		return res.status(403).send("Access denied. Admins only.");
	next();
};

const isBusiness = (req, res, next) => {
	if (!req.user?.isBusiness)
		return res.status(403).send("Access denied. Business users only.");
	next();
};

module.exports = { auth, isAdmin, isBusiness };
