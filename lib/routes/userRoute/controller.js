const userServise = require('../../servises/userServise');

exports.registrationUser = async (req, res) => {
  const data = req.body;
  const result = await userServise.registrationUser(data);
  const resultKey = Object.keys(result);

  if (resultKey[0] === 'error') {
    return res.status(result.status).json({
      error: result.error,
    });
  }

  return res.json({
    success: result.success,
    accessToken: result.aToken,
    refreshToken: result.rToken,
  });
};

exports.authorization = async (req, res) => {
  const data = {
    nickname: req.body.nickname,
    password: req.body.password,
    userRole: 'user',
  };
  const result = await userServise.authorization(data);
  const resultKey = Object.keys(result);

  if (resultKey[0] === 'error') {
    return res.status(result.status).json({
      error: result.error,
    });
  }

  return res.json({
    success: result.success,
    accessToken: result.aToken,
    refreshToken: result.rToken,
  });
};

exports.uploadImg = async (req, res) => {
  const data = {
    user: req.user,
    img: req.files.img,
  };
  const upload = await userServise.uploadImg(data);
  const resultKey = Object.keys(upload);

  if (resultKey[0] === 'error') {
    return res.status(upload.status).json({
      error: upload.error,
    });
  }

  return res.json({
    success: upload.success,
  });
};
