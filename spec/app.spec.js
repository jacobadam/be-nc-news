process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("the api router --> /api", () => {
  beforeEach("app", () => {
    return connection.seed.run();
    //runs the seed before every test
  });
  after(() => {
    return connection.destroy();
    //stops connection to the DB
  });
  //SORT BY GET/POST/PATCH/DELETE
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
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(4a) PATCH / STATUS 200 - adds a key value inc_votes which will have the property indicating how much the votes should be updated by", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ parameter: "votes", value: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.be.an("object");
        });
    });
    it("(4b) PATCH / STATUS 200 - adds a value of 10 to the current vote count", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ parameter: "votes", value: 10 })
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].votes).to.equal(110);
        });
    });
    it("(4i) ERROR / STATUS 404 - produces an error as no article, not found", () => {
      return request(app)
        .patch("/api/articles/1000")
        .send({ parameter: "votes", value: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article not found");
        });
    });
    it("(4ii) ERROR / STATUS 400 - produces an error as article in wrong format, bad request", () => {
      return request(app)
        .patch("/api/articles/badrequest")
        .send({ parameter: "votes", value: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(4iii) ERROR / STATUS 400 - produces an error as key is missing, bad request ", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ value: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(4iv) ERROR / STATUS 400 - produces an error as property is missing - bad request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ parmater: "", value: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(5a) POST / STATUS 200 - expect to return an object", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment[0]).to.be.an("object");
        });
    });
    it("(5b) POST / STATUS 200 - posts an object containing key values; username and body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "rogersop",
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment[0]).to.contain.keys("author", "body");
        });
    });
    it("(5i) ERROR / STATUS 400 - produces an error as property is missing, bad request", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "",
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(5ii) ERROR / STATUS 404 - produces an error as key is missing, bad request", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article not found");
        });
    });
    it("(5iii) ERROR / STATUS 400 - produces an error as value entered in incorrect format, bad request", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: 1,
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(5iv) ERROR / STATUS 404 - produces an error as article id does not exist, not found ", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({ username: "jacob", body: "I am queens BLVD" })
        .expect(404)
        .then(({ body }) => {
          console.log(body);
          expect(body.msg).to.equal("not found");
        });
      // NEED TO COMPLETE
    });
    it("(5v) ERROR / STATUS 400 - produces an error as article id entered in incorrect format, bad request ", () => {
      return request(app)
        .post("/api/articles/hello/comments")
        .send({ username: "jacob", body: "I am queens BLVD" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(6a) GET / STATUS 200 - checks if there is an array of comments containing an object with specific key values", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.be.an("object");
          expect(body.comments[0]).to.contain.keys(
            "comment_id",
            "article_id",
            "author"
          );
        });
    });
    it("(6b) GET / STATUS 200 - adds a sort_by query which sorts created_at", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("created_at");
        });
    });
    it("(6c) GET / STATUS 200 - adds a sort_by query which sorts comments by any valid column", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("votes");
        });
    });
    it("(6d) GET / STATUS 200 - adds an order query which allows columns to be sorted ascendingly or descendingly", () => {
      return request(app)
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("created_at", {
            ascending: true
          });
        });
    });
    it("(6e) GET / STATUS 200 - query order defaults to descending", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("created_at", {
            descending: true
          });
        });
    });
    it("(6i) ERROR / STATUS 404 - produces an error as article id does not exist, not found", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("article not found");
        });
    });
    it("(6ii) ERROR / STATUS 400 - produces an error as article_id is in wrong format, bad request", () => {
      return request(app)
        .get("/api/articles/wrong/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(6iii) ERROR / STATUS 400 - produces an error as sort_by column does not exist, bad request", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
    });
    it("(6iv) ERROR / STATUS 400 - produces an error as order value is incorrect, bad request", () => {
      return request(app)
        .get("/api/articles/1/comments?order=hello")
        .expect(200)
        .then(({ body }) => {
          expect(body.msg).to.equal("bad request");
        });
      //NEED TO FIX
    });
    it("(7a) GET / STATUS 200 / checks if there is an array of comments containing an object with specific key values", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.an("array");
          expect(body.articles[0]).to.be.an("object");
        });
    });
    it("(7b) GET / STATUS 200 / adds a sort_by query which sorts comments by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.descendingBy("topic");
        });
    });
  });
});

//do I need a bad path error for each test - api/article instead of api/articles
//different test for is it an object/array/key values
//help with the author/topic query
