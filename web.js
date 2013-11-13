var express         	= require('express')
  , http            	= require('http')
  , reload 				    = require('reload')
  , path            	= require('path')
  , passport 			    = require('passport')
  , mongoose          = require('mongoose')
  , config            = require('./ouath.js')
  , userManager       = require('./server/routes/userManager.js')
  , questionManager   = require('./server/routes/questionManager.js')
  , tutorManager      = require('./server/routes/tutorManager.js')
  , routes            = require('./server/routes')
  , FacebookStrategy 	= require('passport-facebook').Strategy
  , LocalStrategy     = require('passport-local').Strategy;

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config
passport.use(new FacebookStrategy({
    clientID: config.fb.clientID,
    clientSecret: config.fb.clientSecret,
    callbackURL: config.fb.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
   process.nextTick(function () {
     return done(null, profile);
   });
  }
));

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

// mongoose.connect('mongodb://raph:raph@paulo.mongohq.com:10061/app19381734');
mongoose.connect('mongodb://raph:sacha123@paulo.mongohq.com:10072/app19407881');
//mongoose.connect('mongodb://localhost/speed');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Connected to MongoDB");
});

/*
 * SCHEMAS
 */
var Schema = mongoose.Schema;


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

app.use(express.session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'speedTutoring')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/home', ensureAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});

app.get('/', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook'),
  function(req, res){ });

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



app.post('/api/v1/user/', function (req, res) {

  var p = userManager.createUser(req, res);

  p.then(function(docs){
      res.send(200, docs);
    }, function (err){
      res.send(500,err);
    }

  );

});

app.get('/api/v1/user/', function (req, res) {

  userManager.dumpUserDatabase(req, res);
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

app.post('/api/v1/login/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.redirect('/login.html')
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

/***** Dynamic Files *****/

var server = http.createServer(app);

reload(server, app, 1500);


server.listen(app.get('port'), function (){
    console.log('Express server listening on port ' + app.get('port'));
});
