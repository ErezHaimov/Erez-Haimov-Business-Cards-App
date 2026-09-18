const Card = require("../models/Card");
const { validateCard } = require("../validation/cardValidation");
const generateBizNumber = require("../utils/generateBizNumber");

const getAllCards = async (req, res, next) => {
	try {
		const cards = await Card.find();
		res.status(200).send(cards);
	} catch (error) {
		next(error);
	}
};

const getMyCards = async (req, res, next) => {
	try {
		const cards = await Card.find({ user_id: req.user._id });
		res.status(200).send(cards);
	} catch (error) {
		next(error);
	}
};

const getCard = async (req, res, next) => {
	try {
		const card = await Card.findById(req.params.id);
		if (!card) return res.status(404).send("Card not found");
		res.status(200).send(card);
	} catch (error) {
		next(error);
	}
};

const createCard = async (req, res, next) => {
	try {
		const { error } = validateCard(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const bizNumber = await generateBizNumber();

		const card = new Card({
			...req.body,
			bizNumber,
			user_id: req.user._id,
		});
		await card.save();

		res.status(201).send(card);
	} catch (error) {
		next(error);
	}
};

const updateCard = async (req, res, next) => {
	try {
		const card = await Card.findById(req.params.id);
		if (!card) return res.status(404).send("Card not found");

		if (card.user_id.toString() !== req.user._id)
			return res
				.status(403)
				.send("Access denied. Only the card owner can edit it.");

		const { error } = validateCard(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const updatedCard = await Card.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			},
		);

		res.status(200).send(updatedCard);
	} catch (error) {
		next(error);
	}
};

const likeCard = async (req, res, next) => {
	try {
		const card = await Card.findById(req.params.id);
		if (!card) return res.status(404).send("Card not found");

		const userIndex = card.likes.findIndex(
			(id) => id.toString() === req.user._id,
		);

		if (userIndex === -1) {
			card.likes.push(req.user._id);
		} else {
			card.likes.splice(userIndex, 1);
		}

		await card.save();
		res.status(200).send(card);
	} catch (error) {
		next(error);
	}
};

const deleteCard = async (req, res, next) => {
	try {
		const card = await Card.findById(req.params.id);
		if (!card) return res.status(404).send("Card not found");

		const isOwnerOrAdmin =
			card.user_id.toString() === req.user._id || req.user.isAdmin;
		if (!isOwnerOrAdmin) return res.status(403).send("Access denied");

		const deletedCard = await Card.findByIdAndDelete(req.params.id);
		res.status(200).send(deletedCard);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllCards,
	getMyCards,
	getCard,
	createCard,
	updateCard,
	likeCard,
	deleteCard,
};
