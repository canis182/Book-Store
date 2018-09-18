const tokenServise = require('../../servises/tokenServise');

exports.newTokens = async (req, res) => {
  const newTokens = await tokenServise.newTokens(req.userRefreshToken);

  if (Object.keys(newTokens)[0] === 'success') {
    return res.json({
      accessToken: newTokens.success.newAccessToken,
      refreshToken: newTokens.success.newRefreshToken,
    });
  }

  return res.status(newTokens.status).json({
    error: newTokens.error,
  });
};
