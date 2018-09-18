const bookServise = require('../../servises/bookServise');

exports.searchBook = async (req, res) => {
  const data = req.query.query;
  const result = await bookServise.search(data);
  const resultKey = Object.keys(result);

  if (resultKey[0] === 'error') {
    return res.status(result.status).json({
      error: result.error,
    });
  }

  return res.json({
    success: result.success,
  });
};

exports.readBook = async (req, res) => {
  const data = req.params.id;
  const result = await bookServise.readBook(data);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};

exports.addComment = async (req, res) => {
  const data = {
    bookId: req.params.id,
    comment: req.body.comment,
    nickname: req.body.nickname,
  };

  const result = await bookServise.addComment(data);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};

exports.addBook = async (req, res) => {
  const newBook = req.body;
  const result = await bookServise.addBook(newBook);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};

exports.changeBook = async (req, res) => {
  const data = {
    bookId: req.params.id,
    changeElement: req.body,
  };
  const result = await bookServise.changeBook(data);

  if (Object.keys(result)[0] === 'success') {
    return res.json({
      success: result.success,
    });
  }

  return res.status(result.status).json({
    error: result.error,
  });
};
