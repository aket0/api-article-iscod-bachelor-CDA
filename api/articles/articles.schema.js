const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

let Article;

module.exports = Article = model("Article", articleSchema);
