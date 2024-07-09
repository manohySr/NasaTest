const { loadPlanetsData } = require("../../models/planets/planets.model.js");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo.js");
const app = require("./../../app.js");
const request = require("supertest");

beforeAll(async () => {
  jest.setTimeout(10000);
  await mongoConnect();
  await loadPlanetsData();
});

afterAll(async () => {
  jest.setTimeout(10000);
  await mongoDisconnect();
});

describe("LAUNCHES API", () => {
  describe("Test GET /v1/launch", () => {
    test("It should response 200 success", async () => {
      await request(app).get("/v1/launch").expect(200);
    });
  });

  describe("Test POST /v1/launch", () => {
    const completeDataLaunch = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "January 20, 2030",
      target: "Kepler-1652 b",
    };
    const dataLaunchWithoutDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      target: "Kepler-1652 b",
    };
    const dataLaunchInvalidDate = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      launchDate: "groot",
      target: "Kepler-1652 b",
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
