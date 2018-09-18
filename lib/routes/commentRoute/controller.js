const commentServise = require('../../servises/commentServise');

module.exports.searchBookForName = async (req, res) => {
  const { name } = req.query;
  const result = await commentServise.searchComment(name);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};

module.exports.delateAllComments = async (req, res) => {
  const { name } = req.query;
  const result = await commentServise.delateAllCommentByUserName(name);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};

module.exports.deleteCommentById = async (req, res) => {
  const commentId = req.query.id;
  const result = await commentServise.deleteCommentById(commentId);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};
