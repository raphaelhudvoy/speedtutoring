var express         = require('express')
  , http            = require('http')
  , path            = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/speedTutoring');
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/speedTutoring'));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'speedTutoring')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/***** Dynamic Files *****/

var server = http.createServer(app);


server.listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
});
