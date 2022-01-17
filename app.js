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

app.use('/logged/api', (req, res, next) => {
    if (!req.session.isLogged) {
        return res.send('7');
    } else
        next();
})
app.use('/logged', marsBrowserRouter);
app.use('/logged/api', apiRouter);

app.use('/api', apiRouter);

app.use('/', (req, res, next) => {
    console.log(req.session.isLogged);
    if (req.session.isLogged) {
        return res.redirect('/logged/marsBrowser');
    }
    next();
})
app.use('/', indexRouter);
app.use('/', authenticationRouter);

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
