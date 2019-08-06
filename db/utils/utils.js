exports.formatDates = list => {
  return list.map(article => {
    const { created_at, ...restOfData } = article;
    return { ...restOfData, created_at: new Date(created_at) };
  });
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};
  list.forEach(comment => {
    refObj[comment[key]] = comment[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    const { created_by, belongs_to, created_at, ...restOfComments } = comment;
    return {
      ...restOfComments,
      author: created_by,
      article_id: articleRef[belongs_to],
      created_at: new Date(created_at)
    };
  });
};
