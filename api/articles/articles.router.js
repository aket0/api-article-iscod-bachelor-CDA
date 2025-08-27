const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const controller = require("./articles.controller");

router.post("/", auth, controller.createArticle);
router.put("/:id", auth, controller.updateArticle);
router.delete("/:id", auth, controller.deleteArticle);

module.exports = router;
