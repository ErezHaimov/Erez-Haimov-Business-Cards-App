const notFound = (req, res) => {
	res.status(404).send(`Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = notFound;
