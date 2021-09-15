var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var mongoose = require('mongoose');
var CONNECT_STRING = require('./dbconfig');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api_routes');
var makeRouter = require('./routes/populating_db');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
global.app_title = (process.env.APP_TITLE) ? process.env.APP_TITLE : 'Temperature Logger'; // set the app title

global.loggedIn = false;

console.log('Connecting to database using ' + CONNECT_STRING);
mongoose.connect(CONNECT_STRING,
  {
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useNewUrlParser: true
  }).then(() => {
    console.log(`Connected using ${process.env.NODE_ENV} database.`);
  }).catch((err) => {
    console.log(err);
  }
);


// parse body
app.use(express.json());
app.use(express.urlencoded({'extended': true}));

// sessions
var sess = {
  secret: process.env.SECRET,
  rolling: false, 
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))


// middleware
const loggedInData = require('./middleware/loggedInData');

app.use(loggedInData);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
