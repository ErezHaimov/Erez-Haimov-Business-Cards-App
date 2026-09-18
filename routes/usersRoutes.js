const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const {
	registerUser,
	loginUser,
	getAllUsers,
	getUser,
	updateUser,
	changeBusinessStatus,
	deleteUser,
} = require("../controllers/usersController");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", auth, isAdmin, getAllUsers);
router.get("/:id", auth, getUser);
router.put("/:id", auth, updateUser);
router.patch("/:id", auth, changeBusinessStatus);
router.delete("/:id", auth, deleteUser);

module.exports = router;
