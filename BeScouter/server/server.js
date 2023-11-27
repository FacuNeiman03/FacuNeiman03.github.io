var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var configurationRouter = require('./components/Configuration');
var listRouter = require('./components/List');
var loginRouter = require('./components/Login');
var playerDetailRouter = require('./components/PlayerDetail');
var savedPlayersAndTeamsRouter = require('./components/SavedPlayersAndTeams');
var searchBarRouter = require('./components/SearchBar');
var signUpRouter = require('./components/SignUp');
var similarityDetailRouter = require('./components/SimilarityDetail');
var teamDetailRouter = require('./components/TeamDetail');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/Configuration', configurationRouter);
app.use('/', indexRouter);
app.use('/List', listRouter);
app.use('/Login', loginRouter);
app.use('/PlayerDetail',playerDetailRouter);
app.use('/SavedPlayersAndTeams',savedPlayersAndTeamsRouter );
app.use('/SearchBar',searchBarRouter );
app.use('/SignUp', signUpRouter);
app.use('/SimilarityDetail', similarityDetailRouter);
app.use('/TeamDetail',teamDetailRouter);


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
