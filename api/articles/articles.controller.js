const ArticleService = require("./articles.service");

async function createArticle(req, res, next) {
  try {
        console.log("req.user :", req.user);
console.log("userId envoyé :", req.user.userId);
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const article = await ArticleService.createArticle({
      ...req.body,
      user: req.user._id,
    });

    if (req.io) req.io.emit("article_created", article);

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

async function updateArticle(req, res, next) {
  try {
    const user = req.user;
    console.log(user);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    const article = await ArticleService.updateArticle(req.params.id, req.body);

    if (!article) return res.status(404).json({ message: "Not found" });

    if (req.io) req.io.emit("article_updated", article);

    res.json(article);
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    const article = await ArticleService.deleteArticle(req.params.id);

    if (!article) return res.status(404).json({ message: "Not found" });

    if (req.io) req.io.emit("article_deleted", { id: req.params.id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
};
