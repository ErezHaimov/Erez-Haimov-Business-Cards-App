const express = require("express");
const router = express.Router();
const { auth, isBusiness, isAdmin } = require("../middlewares/auth");
const {
	getAllCards,
	getMyCards,
	getCard,
	createCard,
	updateCard,
	likeCard,
	deleteCard,
	changeBizNumber,
} = require("../controllers/cardsController");

router.get("/", getAllCards);
router.get("/my-cards", auth, getMyCards);
router.get("/:id", getCard);
router.post("/", auth, isBusiness, createCard);
router.put("/:id", auth, updateCard);
router.patch("/:id/biz-number", auth, isAdmin, changeBizNumber);
router.patch("/:id", auth, likeCard);
router.delete("/:id", auth, deleteCard);

module.exports = router;
