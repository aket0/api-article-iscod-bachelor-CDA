const Article = require("./articles.schema");
const User = require("../users/users.model");

async function createArticle(data) {
  const article = new Article(data);
  return await article.save();
}

async function updateArticle(id, updateData) {
  return await Article.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteArticle(id) {
  return await Article.findByIdAndDelete(id);
}

async function getArticlesByUser(userId) {
  return await Article.find({ user: userId })
    .populate({
      path: "user",
      select: "-password",
    })
    .exec();
}

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByUser,
};
