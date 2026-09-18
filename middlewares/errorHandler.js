const errorHandler = (err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong on the server");
};

module.exports = errorHandler;
