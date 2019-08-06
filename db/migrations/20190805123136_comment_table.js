exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").default(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};