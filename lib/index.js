const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpLoad = require('express-fileupload');
const passport = require('passport');

const { checkAdminInDb, createAdmin } = require('./preInit');

const userRouter = require('./routes/userRoute/router');
const bookRouter = require('./routes/bookRoute/router');
const tokenRouter = require('./routes/tokenRoute/router');
const commentRouter = require('./routes/commentRoute/router');

const middlewares = require('./middlewares');
const auth = require('./middlewares/authenticate');

const configsApp = require('../configs/indexApp');
const confgsDb = require('../configs/indexDb');

(async () => {
  await mongoose.connect(confgsDb.mongodb);
  const isAdminInDb = await checkAdminInDb();

  if (!isAdminInDb) {
    await createAdmin();
  }

  app.use(bodyParser.json());
  app.use(fileUpLoad());
  app.use(passport.initialize());

  app.use('/api/v1/token', middlewares.checkValidateRefreshToken, tokenRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/books', auth().authenticate(), bookRouter);
  app.use('/api/v1/comments', auth().authenticate(), middlewares.checkAdminRole, commentRouter);

  app.listen(configsApp.port, () => console.log(`Listen on port: ${configsApp.port}`));
})()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = app;
