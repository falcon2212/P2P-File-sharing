var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var mongoose = require("mongoose");
var cors = require('cors');
let APP_CONFIG = require("./config/app_config");
require('dotenv').config();

// import morganBody from "morgan-body";
// import bodyParser from "body-parser";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// var accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/user_activity.log'), { flags: 'a' })
// logger.token('req_body', function (req, res){
//   return JSON.stringify(req.body);
// })
// logger.token('res_body', function (req, res) {
//   return JSON.stringify(res.body);
// })
// app.use(logger(":method :url :status :response-time ms - :req_body :res[content-length]- [:date[clf]]", {
//   skip: function (req, res){
//     return (req.originalUrl.startsWith('/start') || JSON.stringify(req.body) === '{}');
//   },
//   stream: accessLogStream
// }));
// app.use(bodyParser.json());
// morganBody(app);
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
