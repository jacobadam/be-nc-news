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
          expect(body.topics[0]).to.be.an("object");
          expect(body.topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("(1b) GET ALL / STATUS CODE 200 - returns the actual response in an object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.eql([
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" }
          ]);
        });
    });
    it("(1i) ERROR / 404 produces route not found", () => {
      return request(app)
        .get("/api/notfound")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("route not found");
        });
    });
  });
  describe("the users router / users", () => {
    it("(2a) GET ALL / STATUS CODE 200 - checks if there is an array of topic objects", () => {
      return request(app)
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).to.be.an("array");
          expect(body.users[0]).to.be.an("object");
          expect(body.users[0]).to.contain.keys(
            "username",
            "name",
            "avatar_url"
          );
        });
    });
    // it("(2i) ERROR / 400 produces ", () => {
    //   return request(app)
    //     .get("/api/users/1")
    //     .then(({ body }) => {
    //       expect(body.msg).to.equal("route not found");
    //     });
    // });
  });
});
