const request = require("supertest");
const mockingoose = require("mockingoose");
const { app } = require("../server");
const Article = require("../api/articles/articles.schema");


jest.mock("../middlewares/auth", () => (req, res, next) => {
  req.user = {
    _id: "68ad6a429e5c01f690b668fb",
    role: "admin",
    email: "test@example.com",
  };
  next();
});

describe("Articles API", () => {
  const fakeArticle = {
    _id: "64ffb2a0e5c01f690b668fb",
    title: "Test Article",
    content: "Contenu de test",
    user: "68ad6a429e5c01f690b668fb",
  };

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGFkNmE0MjllNWMwMWY2OTBiNjY4ZmIiLCJpYXQiOjE3NTYxOTkxMzMsImV4cCI6MTc1NjQ1ODMzM30.hgyNOeOGfOViO9vPdFHSQBA_wer1LByAdFfMoLxW-gE";

  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("Créer un article", async () => {
    mockingoose(Article).toReturn(fakeArticle, "save");

    const res = await request(app)
      .post("/api/articles")
      .set("x-access-token", token)
      .send({
        title: "Test Article",
        content: "Contenu de test",
        user: "68ad6a429e5c01f690b668fb",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Article");
  });

  test("Mettre à jour un article", async () => {
    const updatedArticle = { ...fakeArticle, title: "Updated Title" };
    mockingoose(Article).toReturn(updatedArticle, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${fakeArticle._id}`)
      .set("x-access-token", token)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("Supprimer un article", async () => {
    mockingoose(Article).toReturn(fakeArticle, "findOneAndDelete");

    const res = await request(app)
      .delete(`/api/articles/${fakeArticle._id}`)
      .set("x-access-token", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });
});
