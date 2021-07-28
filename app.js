var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var mongoose = require('mongoose');
var config = require('./config')[process.env.NODE_ENV];

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api_routes');
var makeRouter = require('./routes/populating_db');

var app = express();
global.app_title = (process.env.APP_TITLE) ? process.env.APP_TITLE : 'Meal planer'; // set the app title


mongoose.connect(config.DBConnect,
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


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/make', makeRouter);

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});*/

app.use(function (err, req, res, next) {
  res.status(err.status).json({status: err.status, message: err.message})
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
