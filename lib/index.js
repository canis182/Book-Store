const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const configsApp = require('../configs/indexApp');
const confgsDb = require('../configs/indexDb');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoute/router');
const bookRouter = require('./routes/bookRoute/router');
const commentRouter = require('./routes/commentRoute/router');
const middlewares = require('./middlewares');

// TODO: если нет подключение к бд то не запуск сервер
// mongoose.connect(confgsDb.mongodb);

// mongoose.connection.on('error', console.error.bind(console, 'connection error:'),
//     console.log('No connection to the database'));
// mongoose.connection.once('open', function () {
//     console.log('Success')
//     app.listen(configsApp.port, () => console.log(`Listen on port: ${configsApp.port}`));
// });

mongoose.connect(confgsDb.mongodb, function (err, database) {
    if (err) {
        return console.log(err);
    };
    app.listen(configsApp.port, () => console.log(`Listen on port: ${configsApp.port}`));
    middlewares.checkAdminInDb();
});


app.use(bodyParser.json());

app.use('/api/v1/users', userRouter)
app.use('/api/v1/books', middlewares.authUser, bookRouter)
app.use('/api/v1/comments', middlewares.authUser, middlewares.checkAdminRole, commentRouter)

module.exports = app;
