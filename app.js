var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var authenticationRouter = require('./routes/authentication');
var marsBrowserRouter = require('./routes/marsBrowser');

var app = express();


var fs = require('fs')
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'http.log'), {flags: 'a'})
app.use(logger('combined', {stream: accessLogStream}));

app.use(cookieParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "somesecretkey",
    resave: false, // Force save of session for each request
    saveUninitialized: false, // Save a session that is new, but has not been modified
    cookie: {maxAge: 100 * 60 * 1000} // milliseconds!
}));

/**
 * In any case where a request is made to access the database and there is no logged in user, the function sends a response error code ("7") which signals to the customer that there is no logged in user.
 * Only if there is a connected user can Next Continue functions be performed
 */
app.use('/logged/api', (req, res, next) => {
    if (!req.session.isLogged) {
        return res.send('7');
    } else
        next();
})
app.use('/logged', marsBrowserRouter);
app.use('/logged/api', apiRouter);

app.use('/api', apiRouter);

/**
 * In case the user is already logged in, access to the verification pages is blocked and he is immediately transferred to the main page of the site
 */
app.use('/', (req, res, next) => {
    if (req.session.isLogged) {
        return res.redirect('/logged/marsBrowser');
    }
    next();
})
app.use('/', indexRouter);
app.use('/', authenticationRouter);

/**
 * Each request by means of a URL implemented only in POST will be redirected to the login page
 */
app.use('*', (req, res) => {
    res.redirect('/');
});


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
    res.render('error');
});

module.exports = app;
