const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	// express.json() throws this when the request body isn't valid JSON -
	// that's a client mistake, not a server failure, so return 400 not 500
	if (err.type === "entity.parse.failed" || err instanceof SyntaxError) {
		return res.status(400).send("Invalid JSON in request body");
	}

	res.status(500).send("Something went wrong on the server");
};

module.exports = errorHandler;
