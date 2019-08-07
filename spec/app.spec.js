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
    it("(1i) ERROR / 404 - produces an error for bad route, not found", () => {
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
    it("(2i) ERROR / 404 - produces an error for bad route, not found", () => {
      return request(app)
        .get("/api/user/routenotfound")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("route not found");
        });
    });
    it("(2ii) ERROR / 404 - produces an error as no username, not found", () => {
      return request(app)
        .get("/api/users/invalid-user-name")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("username not found");
        });
    });
  });
  describe("the article router / articles", () => {
    it("(3a) GET ALL / STATUS CODE 200 - checks if there is an array of article objects", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.be.an("object");
          expect(body.articles[0]).to.contain.keys("title", "votes", "body");
        });
    });
    it("(3b) GET ALL / STATUS CODE 200 - adds a new comment_count key that shows the total count of comments against this article id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const array = body.articles;
          parsedComment = array.map(comment => {
            comment.comment_count = Number(comment.comment_count);
            return comment;
          });
          expect(parsedComment).to.eql([
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            }
          ]);
        });
    });
    it("(3i) ERROR / 404 - produces an error as no username, not found", () => {
      return request(app)
        .get("/api/articles/300")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("username not found");
        });
    });
    it("(3ii) ERROR / 400 - produces an error as username in wrong format, bad request", () => {
      return request(app)
        .get("/api/articles/name")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("username not found");
        });
    });
    it("(4a) PATCH / STATUS 201 - adds a key value inc_votes which will have the property indicating how much the votes should be updated by", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ parameter: "votes", value: 10 })
        .expect(201)
        .then(({ body }) => {
          expect(body.articles[0]).to.be.an("object");
        });
    });
    it("(4b) PATCH / STATUS 201 - adds a value of 10 to the current vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ parameter: "votes", value: 10 })
        .expect(201)
        .then(({ body }) => {
          expect(body.articles[0].votes).to.equal(110);
        });
    });
    it("(4i) ERROR / STATUS 404 - produces an error as no username, not found", () => {
      return request(app)
        .patch("/api/articles/1000")
        .send({ parameter: "votes", value: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("username not found");
        });
    });
    it("(4ii) ERROR / STATUS 400 - produces an error as username in wrong format, bad request", () => {
      return request(app)
        .patch("/api/articles/badrequest")
        .send({ parameter: "votes", value: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("username not found");
        });
    });
    it("(4iii) ERROR / STATUS 400 - produces an error as key is missing, bad request ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ value: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request - key is missing");
        });
    });
  });
});


//do I need a bad path error for each test - api/article instead of api/articles

//install npm i chaisorted
