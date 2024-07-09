const { loadPlanetsData } = require("../../models/planets/planets.model.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");
const app = require("./../../app.js");
const request = require("supertest");

describe("PLANETS API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /planet", () => {
    test("It should response 200 success", async () => {
      await request(app).get("/planet").expect(200);
    });
  });
});
