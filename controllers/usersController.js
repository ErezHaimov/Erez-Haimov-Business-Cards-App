const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validateUser } = require("../validation/userValidation");
const { validateUserUpdate } = require("../validation/userUpdateValidation");
const { validateLogin } = require("../validation/loginValidation");
const generateToken = require("../utils/generateToken");

const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_FAILED_ATTEMPTS = 3;

const registerUser = async (req, res, next) => {
	try {
		const { error } = validateUser(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const existingUser = await User.findOne({
			email: req.body.email.toLowerCase(),
		});
		if (existingUser)
			return res.status(400).send("User with this email already exists");

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = new User({ ...req.body, password: hashedPassword });
		await user.save();

		res.status(201).send(user);
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	try {
		const { error } = validateLogin(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const { email, password } = req.body;
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) return res.status(400).send("Invalid email or password");

		// block login for 24h after 3 consecutive failed attempts
		if (user.blockedUntil && user.blockedUntil > new Date()) {
			return res
				.status(403)
				.send(
					`Too many failed login attempts. Try again after ${user.blockedUntil.toISOString()}`,
				);
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

			if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
				user.blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS);
				await user.save();
				return res
					.status(403)
					.send(
						`Too many failed login attempts. Account blocked until ${user.blockedUntil.toISOString()}`,
					);
			}

			await user.save();
			return res.status(400).send("Invalid email or password");
		}

		// Successful login - reset the failed-attempt counter and any block
		user.failedLoginAttempts = 0;
		user.blockedUntil = null;
		await user.save();

		const token = generateToken(user);
		res.status(200).send(token);
	} catch (error) {
		next(error);
	}
};

const getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).send(users);
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const isSelfOrAdmin =
			req.user._id === req.params.id || req.user.isAdmin;
		if (!isSelfOrAdmin) return res.status(403).send("Access denied");

		const user = await User.findById(req.params.id).select("-password");
		if (!user) return res.status(404).send("User not found");

		res.status(200).send(user);
	} catch (error) {
		next(error);
	}
};

const updateUser = async (req, res, next) => {
	try {
		if (req.user._id !== req.params.id)
			return res
				.status(403)
				.send("Access denied. You can only edit your own profile.");

		const { error } = validateUserUpdate(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const updateData = { ...req.body };

		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			updateData.password = await bcrypt.hash(req.body.password, salt);
		} else {
			delete updateData.password;
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true },
		).select("-password");

		res.status(200).send(updatedUser);
	} catch (error) {
		next(error);
	}
};

const changeBusinessStatus = async (req, res, next) => {
	try {
		if (req.user._id !== req.params.id)
			return res.status(403).send("Access denied");

		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).send("User not found");

		user.isBusiness = !user.isBusiness;
		await user.save();

		res.status(200).send(user);
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const isSelfOrAdmin =
			req.user._id === req.params.id || req.user.isAdmin;
		if (!isSelfOrAdmin) return res.status(403).send("Access denied");

		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser) return res.status(404).send("User not found");

		res.status(200).send(deletedUser);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	registerUser,
	loginUser,
	getAllUsers,
	getUser,
	updateUser,
	changeBusinessStatus,
	deleteUser,
};
