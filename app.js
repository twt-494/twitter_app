const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const dotenvfile = process.env.NODE_ENV === 'test' ? `${process.cwd()}/.env.testing` : `${process.cwd()}/.env`
dotenv.config({path: dotenvfile});

const twitterRouter = require('./routes/twitter-router');
const keywordRouter = require('./routes/keyword-router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/tweets', twitterRouter);
app.use('/keywords', keywordRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app;
