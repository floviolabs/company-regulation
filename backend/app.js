var path = require('path');
var cors = require('cors');
var logger = require('morgan');
var express = require('express');
var cookieParser = require('cookie-parser');

const app = express();
const dotenv = require('dotenv');
var indexRoute = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

dotenv.config();
app.use(cors({
  origin: '*',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/static', express.static(path.join(__dirname, 'public')))
app.use('/api/sharing-file', express.static(path.join(__dirname, 'public/sharing-file')))
// app.use('/dev/api/v1/', indexRoute); //dev
// app.use('/uat/api/v1/', indexRoute); //uat
app.use('/api/v1/', indexRoute); //pro

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;