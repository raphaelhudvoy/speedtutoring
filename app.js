var express         	= require('express')
  , http            	= require('http')
  , reload 				    = require('reload')
  , path            	= require('path')
  , passport 			    = require('passport')
  , mongoose          = require('mongoose')
  , userManager       = require('./server/routes/userManager.js')
  , questionManager   = require('./server/routes/questionManager.js')
  , tutorManager   = require('./server/routes/tutorManager.js')
  , FacebookStrategy 	= require('passport-facebook').Strategy;
//User serialization
passport.serializeUser(function (user, done) {
  done(null, user.user_ID);
});

passport.deserializeUser(function (id, done) {
  loginSystem.findUserById(mysql.cursuumDbPool, id, function (err, user) {
    done(err, { user_ID : user.user_ID,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name });
  });
});

//Passport-local strategy
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
  },

  function(username, password, done) {

    //asynchronous verificatoin, for effect...
    process.nextTick(function () {

          //Invalid username
          //return done(null, false, { message: 'Unknown user ' + username});

          // validate password

          //succes
          // return done(null, user);
      })
    });
  }
));

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login.html')
}

mongoose.connect('mongodb://localhost/speed');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

/*
 * SCHEMAS
 */
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:  String,
  firstName: String,
  lastName:   String,
  email  : String, 
});

var User = mongoose.model('User', userSchema);

var questionSchema = new Schema({
  title:  String,
  tags: [String] 
});

var Question = mongoose.model('Question', questionSchema);

var tutorSchema = new Schema({
  userId:  String,
  tags: [String] 
});

var Tutor = mongoose.model('Tutor', tutorSchema);

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

  userManager.createUser(User, req, res);
});

app.get('/api/v1/user/', function (req, res) {

  userManager.dumpUserDatabase(User, req, res);
});


app.post('/api/v1/question/', function (req, res) {

  questionManager.askQuestion(Question, req, res);
});

app.get('/api/v1/question/', function (req, res) {

  questionManager.dumpQuestionDatabase(Question, req, res);
});


app.post('/api/v1/tutor/', function (req, res) {
  tutorManager.registerTutor(Tutor, req, res);
});

/***** Dynamic Files *****/

var server = http.createServer(app);

reload(server, app, 1500);


server.listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
});
