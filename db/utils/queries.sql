\c nc_news_test;

SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id;
-- LEFT JOIN comments ON articles.article_id = comments.article_id
-- GROUP BY comment_id;

-- comment_count which is the total count of all the comments with this article_id - you should make use of knex queries in order to achieve this

-- KNEX
-- return connection.select('articles.*').from('articles').count(comment_id AS comment_id).where(articles.article_id, article_id).leftjoin('comments', 'articles.article_id', '=', 'comments.article_id').groupBy('articles.article_id')