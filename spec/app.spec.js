process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const { expect } = chai;
const connection = require("../db/connection");

describe("the api router --> /api", () => {
  beforeEach("app", () => {
    return connection.seed.run();
    //runs the seed before every test
  });
  after(() => {
    return connection.destroy();
    //stops connection to the DB
  });
  describe("the topics router / topics", () => {
    it("(1a) GET ALL / STATUS CODE 200 - checks if there is an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an("array");
        });
    });
  });
});
