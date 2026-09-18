const express = require("express");
const router = express.Router();
const { auth, isBusiness } = require("../middlewares/auth");
const {
	getAllCards,
	getMyCards,
	getCard,
	createCard,
	updateCard,
	likeCard,
	deleteCard,
} = require("../controllers/cardsController");

router.get("/", getAllCards);
router.get("/my-cards", auth, getMyCards);
router.get("/:id", getCard);
router.post("/", auth, isBusiness, createCard);
router.put("/:id", auth, updateCard);
router.patch("/:id", auth, likeCard);
router.delete("/:id", auth, deleteCard);

module.exports = router;
