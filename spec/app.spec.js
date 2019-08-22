process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("API ROUTER ", () => {
  beforeEach("app", () => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });
  it("(i) ERROR / 405 - produces an error for invalid method", () => {
    return request(app)
      .delete("/api")
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.equal("method not allowed");
      });
  });
  describe("topics router", () => {
    describe("GET ALL - /TOPICS", () => {
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
      it("1ii ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .post("/api/topics")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
  });
  describe("users router", () => {
    describe("GET- /USERS/:USERNAME", () => {
      it("(2a) GET / STATUS CODE 200 - checks if there is an array of topic objects", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.be.an("object");
            expect(body.user).to.contain.keys("username", "name", "avatar_url");
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
      it("2iii) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .delete("/api/users/rogersop")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
  });
  describe("articles router", () => {
    describe("GET - /ARTICLES/:ARTICLE_ID", () => {
      it("(3a) GET / STATUS CODE 200 - checks if there is an array of article objects", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.be.an("object");
            expect(body.article).to.contain.keys(
              "title",
              "votes",
              "body",
              "author",
              "article_id",
              "topic",
              "created_at",
              "comment_count"
            );
          });
      });
      it("(3b) GET / STATUS CODE 200 - adds a new comment_count key that shows the total count of comments against this article id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13
            });
          });
      });
      it("(3i) ERROR / 404 - produces an error as no article found, not found", () => {
        return request(app)
          .get("/api/articles/300")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("article not found");
          });
      });
      it("(3ii) ERROR / 400 - produces an error as article id in wrong format, bad request", () => {
        return request(app)
          .get("/api/articles/name")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(3iii) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
    describe("PATCH - /ARTICLES/:ARTICLE_ID", () => {
      it("(4a) PATCH / STATUS 200 - adds a key value inc_votes which will have the property indicating how much the votes should be updated by", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.be.an("object");
          });
      });
      it("(4b) PATCH / STATUS 200 - adds a value of 10 to the current vote count", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(110);
          });
      });
      it("(4c) PATCH / STATUS 200 - inv_votes key defaults to 0 if no value is specified, therefore current vote count remains the same", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(100);
          });
      });
      it("(4i) ERROR / STATUS 404 - produces an error as no article, not found", () => {
        return request(app)
          .patch("/api/articles/1000")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("article not found");
          });
      });
      it("(4ii) ERROR / STATUS 400 - produces an error as article_id in wrong format, bad request", () => {
        return request(app)
          .patch("/api/articles/badrequest")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(4iv) ERROR / STATUS 400 - produces an error as property is missing - bad request", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(4v) ERROR / STATUS 400 - produces an error as invalid propery given on key value", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
    });
    describe("POST - /ARTICLES/:ARTICLE_ID/COMMENTS", () => {
      it("(5a) POST / STATUS 200 - expect to return an object", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "rogersop",
            body:
              "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.be.an("object");
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
            expect(body.comment).to.contain.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
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
      it("(5ii) ERROR / STATUS 400 - produces an error as key is missing, bad request", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            body:
              "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
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
          .send({
            username: "butter_bridge",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("article not found");
          });
      });
      it("(5v) ERROR / STATUS 400 - produces an error as article id entered in incorrect format, bad request ", () => {
        return request(app)
          .post("/api/articles/hello/comments")
          .send({
            username: "butter_bridge",
            body:
              "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
    });
    describe("GET ALL /ARTICLES/ARTICLE_ID/COMMENTS", () => {
      it("(6a) GET / STATUS 200 - checks if there is an array of comments containing an object with specific key values", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an("array");
            expect(body.comments[0]).to.be.an("object");
            expect(body.comments[0]).to.contain.keys(
              "comment_id",
              "author",
              "votes",
              "body",
              "created_at"
            );
          });
      });
      it("(6b) GET / STATUS 200 - adds a sort_by query which sorts created_at, as the default value", () => {
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
      it("(6f) GET / STATUS 200 - returns an empty array if existing article contains no comments", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.eql([]);
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
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("order input not valid");
          });
      });
      it("(6v) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
    describe("GET ALL / ARTICLES", () => {
      it("(7a) GET / STATUS 200 / checks if there is an array of comments containing an object with specific key values", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an("array");
            expect(body.articles[0]).to.be.an("object");
            expect(body.articles[0]).to.contain.key(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("(7b) GET / STATUS 200 / adds a sort_by query which sorts by created_at, as the default value", () => {
        return request(app)
          .get("/api/articles?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
          });
      });
      it("(7c) GET / STATUS 200 / adds a sort_by query which sorts comments by any valid column", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("votes");
          });
      });
      it("(7d) GET / STATUS 200 / adds an order query which allows columns to be sorted ascendingly or descendingly", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              ascending: true
            });
          });
      });
      it("(7e) GET / STATUS 200 - query order defaults to descending", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at", {
              descending: true
            });
          });
      });
      it("(7f) GET / STATUS 200 - filters the articles by a username value specified in query", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.every(article => article.author === "rogersop")).to
              .be.true;
          });
      });
      it("(7g) GET / STATUS 200 - filters the articles by a topic value specified in query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.every(article => article.topic === "mitch")).to.be
              .true;
          });
      });
      it("(7i) ERROR / STATUS 404 - produces an error for a bad route, not found", () => {
        return request(app)
          .get("/api/article")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("route not found");
          });
      });
      it("(7ii) ERROR / STATUS 400 - produces an error as sort_by column does not exist, bad request", () => {
        return request(app)
          .get("/api/articles?sort_by=hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(7iii) ERROR / STATUS 400 - produces an error an author is not in the database", () => {
        return request(app)
          .get("/api/articles?author=hello")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("not found");
          });
      });
      it("(7iv) ERROR / STATUS 400 - produces an error a topic is not in the database", () => {
        return request(app)
          .get("/api/articles?topic=hello")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("not found");
          });
      });
      it("(7v) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      it("(7vi) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .post("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      it("(7vii) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .patch("/api/articles")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
  });
  describe("comments router", () => {
    describe("PATCH /COMMENTS/:COMMENT_ID", () => {
      it("(8a) PATCH / STATUS 200 - adds a key value inc_votes which will have the property indicating how much the votes should be updated by", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).to.be.an("object");
          });
      });
      it("(8b) PATCH / STATUS 200 - adds a value of 10 to the current vote count", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(6);
          });
      });
      it("(8c) PATCH / STATUS 200 - inv_votes key defaults to 0 if no value is specified, therefore current vote count remains the same", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).to.equal(16);
          });
      });
      it("(8i) ERROR / STATUS 404 - produces an error as no comment, not found", () => {
        return request(app)
          .patch("/api/comments/1000")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("comment not found");
          });
      });
      it("(8ii) ERROR / STATUS 400 - produces an error as comment_id in wrong format, bad request", () => {
        return request(app)
          .patch("/api/comments/badrequest")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(8iv) ERROR / STATUS 400 - produces an error as property is missing - bad request", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(8v) ERROR / STATUS 400 - produces an error as invalid property given on key value", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(8vii) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .post("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
      it("(8viii) ERROR / 405 - produces an error for invalid method", () => {
        return request(app)
          .get("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("method not allowed");
          });
      });
    });
    describe("DELETE / COMMENTS/:COMMENT_ID", () => {
      it("(9a) DELETE / STATUS 204 - deletes a given comment by comment_id", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("(9i) ERROR / STATUS 400 -> incorrect Id format given - bad request", () => {
        return request(app)
          .delete("/api/comments/hello")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("bad request");
          });
      });
      it("(9ii) ERROR / STATUS 404 -> Id is correct format but references a comment that does not exist - should not be found", () => {
        return request(app)
          .delete("/api/comments/100000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("comment not found");
          });
      });
    });
  });
});
