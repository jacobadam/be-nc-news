const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns a new array if an empty array is passed", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("returns a new array containing a single object, if a single object is passed", () => {
    const input = [
      {
        title: "hello goodbye",
        body: "life",
        votes: 5,
        topic: "you say yes",
        author: "jacob",
        created_at: 1542284514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "hello goodbye",
        body: "life",
        votes: 5,
        topic: "you say yes",
        author: "jacob",
        created_at: new Date(1542284514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns a new array containing multiple objects, if more than one object is passed", () => {
    const input = [
      {
        title: "hello goodbye",
        body: "life",
        votes: 5,
        topic: "you say yes",
        author: "jacob",
        created_at: 1542284514171
      },
      {
        title: "all my life",
        body: "rubber soul",
        votes: 10,
        topic: "places I remember",
        author: "paul",
        created_at: 1289996514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        title: "hello goodbye",
        body: "life",
        votes: 5,
        topic: "you say yes",
        author: "jacob",
        created_at: new Date(1542284514171)
      },
      {
        title: "all my life",
        body: "rubber soul",
        votes: 10,
        topic: "places I remember",
        author: "paul",
        created_at: new Date(1289996514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object if no value is passed", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("returns a single ref object if a single array containing a single object is passed", () => {
    const input = [{ article_id: 1, title: "A" }];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("returns multiple ref objects if an array containing more than one object is passed", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 1, B: 2 };
    expect(actual).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("returns an array if no value is passed", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("returns a formatted new array when passed a single array containing a single comment object", () => {
    const input = [
      {
        created_by: "jacob",
        belongs_to: "help",
        created_at: 1511354163389,
        votes: 16,
        body: "i need somebody"
      }
    ];
    const articleRef = { help: 1 };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        author: "jacob",
        article_id: 1,
        created_at: new Date(1511354163389),
        votes: 16,
        body: "i need somebody"
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("returns a formatted new array when passed a single array with more than one comment object", () => {
    const input = [
      {
        created_by: "jacob",
        belongs_to: "help",
        created_at: 1511354163389,
        votes: 16,
        body: "i need somebody"
      },
      {
        created_by: "john",
        belongs_to: "bye",
        created_at: 1479818163389,
        votes: 10,
        body: "why always me"
      }
    ];
    const articleRef = { help: 1, bye: 2 };
    const actual = formatComments(input, articleRef);
    const expected = [
      {
        author: "jacob",
        article_id: 1,
        created_at: new Date(1511354163389),
        votes: 16,
        body: "i need somebody"
      },
      {
        author: "john",
        article_id: 2,
        created_at: new Date(1479818163389),
        votes: 10,
        body: "why always me"
      }
    ];
    expect(actual).to.eql(expected);
  });
});
