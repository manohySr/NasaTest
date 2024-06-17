const app = require("./../../app.js");
const request = require("supertest");

describe("Test GET /planet", () => {
  test("It should response 200 success", async () => {
    await request(app).get("/planet").expect(200);
  });
});
