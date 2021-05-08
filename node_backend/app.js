var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var cors = require('cors');
let APP_CONFIG = require("./config/app_config");
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/start', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, "../react_frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../react_frontend/build/index.html'));
})

const uri = APP_CONFIG.MONGO_HOST+APP_CONFIG.MONGO_DB;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB connection successful");
});

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
