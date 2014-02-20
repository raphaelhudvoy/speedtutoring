var express         	= require('express')
  , http            	= require('http')
  , io                = require('socket.io')
  , reload 				    = require('reload')
  , path            	= require('path')
  , passport 			    = require('passport')
  , mongoose          = require('mongoose')
  , config            = require('./ouath.js')
  , userManager       = require('./server/routes/userManager.js')
  , questionManager   = require('./server/routes/questionManager.js')
  , tutorManager      = require('./server/routes/tutorManager.js')
  , tagManager        = require('./server/routes/tagManager.js')
  , routes            = require('./server/routes')
  , matching          = require('./server/matching.js')
  , FacebookStrategy 	= require('passport-facebook').Strategy
  , LocalStrategy     = require('passport-local').Strategy
  , whiteboard        = require('./server/libs/whiteboard.js');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  userManager.findById(id, done);
});

// config
passport.use(new FacebookStrategy({
  clientID: config.fb.clientID,
  clientSecret: config.fb.clientSecret,
  callbackURL: config.fb.callbackURL,
},
function(accessToken, refreshToken, profile, done) {
  userManager.logUser(profile, done);
}));

//Passport-local strategy
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
  },

  function(username, password, done) {

    //asynchronous verificatoin, for effect...
    process.nextTick(function () {

      userManager.findUserByUsername(username, function (err, user) {
        if (err) { return done(err); }
        if (!user) { 
                    //Invalid username
          return done(null, false, { message: 'Unknown user ' + username});
        } 
          if (user.password == password) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password'})
          }
      })

    });
    }
));

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

// mongoose.connect('mongodb://raph:jfadsoiqwohjf0984hjg940k23h2he0d@paulo.mongohq.com:10061/app19381734');


//mongoose.connect('mongodb://raph:raph@paulo.mongohq.com:10061/app19381734');
//mongoose.connect('mongodb://raph:sacha123@paulo.mongohq.com:10072/app19407881');

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

app.use(express.session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'speedTutoring')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/views/:name', ensureAuthenticated, function (req, res) {
  var name = req.params.name;
  res.render('views/' + name, {user : req.user});
});

// routes
app.get('/ping', routes.ping);
app.get('/home', ensureAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});

app.get('/', ensureAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('index');
})

app.get('/auth/facebook', passport.authenticate('facebook'),
  function(req, res){ });

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/home');
  }
);

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

app.get('/api/v1/user/id/', function (req, res) {
  res.send(req.user);
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

app.post('/api/v1/tutor/', function(req, res){

  var pTutor = tutorManager.registerTutor(req);

  pTutor.then(function(tutor){
    var pUser = userManager.updateTutor(tutor);

    pUser.then(function(tutor2){
      res.send(200,tutor2);

    }, function(err){
      res.send(500, err);
    });
  }, function(err){
    res.send(500, err);
  })
});





app.post('/api/v1/question/', function (req, res) {

  console.log("Received a new question");

  var p = questionManager.askQuestion(req.body,req,res);

  p.then(function(docs){

    var question = {};

    question.question = docs._doc.question;
    var studentId = docs._doc.userId;

    question.studentId = studentId;

    var availableQuestion = {'question': question, tutors: []};

    //find tutors with tags and sort

    var allTutors = tutorManager.getAllTutors();

    allTutors.then(function(docs){
      var availableTutorsWithTags = docs._doc.tutors;

      availableQuestion.tutors = availableTutorsWithTags;

      availableQuestions[studentId]=availableQuestion;

      contactTutor(studentId);

      res.send(200);
    }, function(err){
      res.send(500,err);
    });

    

    res.send(200);
  }, function(err){
    res.send(500,err);
  });

});


function contactTutor(studentId){

  console.log("Attempting to contact tutor");

  var availableQuestion = getAvailableQuestionFromStudent(studentId);

  

  // //for debugging, emitting to student
  // console.log(availableQuestion);
  // console.log("Emitting event for new Question");
  // socket.sockets.in(studentId).emit("newQuestion", availableQuestion.question, function(response){
  //   console.log("got response");
  // });

  if(availableQuestion !=null){
    if(availableQuestion.tutors.length > 0 ){
      for(var i = 0; i< availableQuestion.tutors.length; i++ ){
      //todo: check if exist tutor and refactor method
        tutor = availableQuestion.tutors[i];

        if(isAvailable(tutor.userId)){
          availableQuestion.question.tutorId = tutor.userId;
          console.log(availableQuestion);
          console.log("Emitting event for new Question");
          socket.sockets.in(tutor.userId).emit("newQuestion", availableQuestion.question, function(response){
            console.log("got response");
          });
          break;
        }else{
          removeTutorFromQuestion(studentId, tutor.userId);
        }
      }
    }
  }
};

function tutorIsAvailable(tutorId){
  // if(tutorList != null){
  //   if(tutorList[tutorId] !=null){
  //     return true;
  //   }
  // }
  return true;
}

function getAvailableQuestionFromStudent(studentId){
  console.log("Getting available question for student");
  if(studentId){
    if(availableQuestions!=null){
      var availableQuestion = availableQuestions[studentId];
      if(availableQuestion != null){
        return availableQuestion;
      }
    }
  }
  return null;
}

function removeTutorFromQuestion(studentId, tutorId){
  var availableQuestion = getAvailableQuestionFromStudent(studentId);

  if (availableQuestion !=null && tutorId){
    possibleTutors = availableQuestion.tutors;

    for (var i = 0; i < possibleTutors.length; i++) {
      if(possibleTutors[i].userId == tutorId){
        possibleTutors.splice(i,1);
        break;
      }
    }
  }
};

/*
var questionTags = docs._doc.tags;

      var questionTutors = [];

      var matchedTags = 0;
      var numberOfTutor = 0;
      var tutorCounter = 0;

      numberOfTutor = tutorList.length;

      function match(cb) {
        tutorList.forEach(function (tutor) {
          var pInfo = tutorManager.getInfo(tutor.userId);

          var numberOfMatchedTags = 0;

          pInfo.then(function (tutorTags) {
            tutorTags.forEach(function (tutorTagId) {
              questionTags.forEach(function (qstTagId) {
                if (tutorTagId.equals(qstTagId)) {
                  numberOfMatchedTags++;
                }
              });
            });
            cb(tutor.userId, numberOfMatchedTags);
          });
        });
      }

      match(function(tutorId, numberOfMatchedTags){
        tutorCounter++;

        if (numberOfMatchedTags > matchedTags) {
          matchedTags = numberOfMatchedTags;
          matchedTutor = tutorId;
        }

        if (tutorCounter == numberOfTutor) {
          console.log("matched Tutor id", matchedTutor);
          res.send(200, matchedTutor);
        }
      });

*/



app.get('/api/v1/user/questions', function (req, res) {


  var p = questionManager.viewQuestions(req.user._doc._id);

  p.then(function(questions){
    res.send(200, questions);
  }, function(err){
    res.send(500, err);
  })

});

app.get('/api/v1/user/isTutor', function (req, res) {

  var p = userManager.isTutor(req.user._doc._id);

  p.then(function(isTutor){
    if(isTutor){
      res.send(200, true);
    }else{
      res.send(200, false);
    }    
  }, function(err){
    res.send(500, err);
  })

});


app.get('/api/v1/tag/', function ( req ,res ) {
  var allTags = tagManager.getAllTags();

  allTags.then(function(tags){
    res.send(200, tags);
  }, function(err){
    res.send(500, err);
  });
});

app.get('/api/v1/dev/tools/connectedUser', function (req, res) {

  res.send(200, people)
  
})

app.post('/api/v1/tutor/', function (req, res) {
  var p = tutorManager.registerTutor(req, res);
  p.then(function(tutor){
    res.send(200, tutor);
  }, function(err){
    res.send(500, err);
  })
});

app.post('/api/v1/login/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.redirect('/')
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/home');
        });
    })(req, res, next);
});


/***** Dynamic Files *****/

var socket             = require('socket.io').listen(app.listen(app.get('port')));

var people             = {};
var availableQuestions = {};
var tutorList          = {};

socket.sockets.on('connection', function (clientSocket) {

  clientSocket.on('join-wb-room', function (data, cb) {

    cb(clientSocket.id);
    whiteboard.init(socket, clientSocket);

  });



  console.log('connected', clientSocket.id);
  clientSocket.on('join', function (userId) {
    //console.log('Join',userId);
    people[clientSocket.id] = { userId : userId, isAvailable : false};  

    clientSocket.join(userId);
  });

  clientSocket.on('availability-on', function () {

    //check available questions

  });

  clientSocket.on('availability-off', function () {

    // tutorList.remove({ socketId: clientSocket.id, userId : userId});

  });

  clientSocket.on('questionResponse', function(response){
    var studentId = response.studentId;
    var tutorId = response.tutorId;
    
    if(response.response == 0){

      socket.sockets.in(studentId).emit("foundTutor", response);

    } else if(response.response == 1){

      removeTutorFromQuestion(studentId, tutorId);

      contactTutor(studentId);
      
    } else{
      //qustion is unclear, must do something eventually
    }
  });


  clientSocket.on('tutorResponse', function(response){
    var studentId = response.studentId;
    var tutorId = response.tutorId;
    
    if(response.response == 0){

      //join tutor room for whiteboard

    } else if(response.response == 1){

      removeTutorFromQuestion(studentId, tutorId);

      contactTutor(studentId);
      
    }
  });

  clientSocket.on('disconnect', function () {

    // tutorList.remove({ socketId: clientSocket.id, 'userId' : userId});
    delete people[clientSocket.id];

  });
});
