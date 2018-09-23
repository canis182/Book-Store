module.exports = {
  algorithm: 'HS512',
  access: {
    type: 'TOKEN_TYPE_ACCESS',
    secret: '908df97bf897gdf8bdf87dbcvbidfjgklrjt84',
    expiresIn: '5m',
  },

  refresh: {
    type: 'TOKEN_TYPE_REFRESH',
    secret: '32afaf980aab5f6ac492af6c264b34e19beefe',
    expiresIn: '24h',
  },
};
