const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");
const app = require("./../../app.js");
const request = require("supertest");

beforeAll(async () => {
  await mongoConnect();
});
afterAll(async () => {
  await mongoDisconnect();
});

describe("PLANETS API", () => {
  describe("Test GET /v1/planet", () => {
    test("It should response 200 success", async () => {
      await request(app).get("/v1/planet").expect(200);
    });
  });
});
