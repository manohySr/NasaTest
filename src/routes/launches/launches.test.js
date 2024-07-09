const { loadLaunchesData } = require("../../models/launches/launches.model.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");
const app = require("./../../app.js");
const request = require("supertest");

describe("LAUNCHES API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /lauch", () => {
    test("It should response 200 success", async () => {
      await request(app).get("/v1/launch").expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeDataLaunch = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "January 20, 2030",
      target: "Kepler-442 b",
    };
    const dataLaunchWithoutDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-442 b",
    };
    const dataLaunchInvalidDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "groot",
      target: "Kepler-442 b",
    };

    test("It should response 201 success", async () => {
      const response = await request(app)
        .post("/v1/launch")
        .send(completeDataLaunch)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestLaunchDate = new Date(
        completeDataLaunch.launchDate
      ).valueOf();
      const responseLaunchDate = new Date(
        response.body.data.launchDate
      ).valueOf();
      expect(responseLaunchDate).toBe(requestLaunchDate);
      expect(response.body.data).toMatchObject(dataLaunchWithoutDate);
    });
    test("It should catch missing error", async () => {
      const response = await request(app)
        .post("/v1/launch")
        .send(dataLaunchWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        ok: false,
        error:
          "launch.mission | launch.rocket | launch.launchDate | launch.target should not be void",
      });
    });

    test("It should catch invalid date error", async () => {
      const response = await request(app)
        .post("/v1/launch")
        .send(dataLaunchInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        ok: false,
        error: "date format error",
      });
    });
  });
});
