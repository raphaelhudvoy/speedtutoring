var express         	= require('express')
  , http            	= require('http')
  , reload 				    = require('reload')
  , path            	= require('path')
  , passport 			    = require('passport')
  , mongoose          = require('mongoose')
  , userManager       = require('./server/routes/userManager.js')
  , FacebookStrategy 	= require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "253787698102458",
    clientSecret: "b82d714a1f5591a76ec7d74fc09d2f49",
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));

mongoose.connect('mongodb://localhost/speed');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});


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

app.post('/api/v1/user/', function (req, res) {

  userManager.createUser(db, req, res);
});


/***** Dynamic Files *****/

var server = http.createServer(app);

reload(server, app, 1500);


server.listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
});
