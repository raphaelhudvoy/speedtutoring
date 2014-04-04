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

//mongoose.connect('mongodb://raph:jfadsoiqwohjf0984hjg940k23h2he0d@paulo.mongohq.com:10061/app19381734');


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
  userManager.createUser(req, res, function(err, newUser){
    if(err){
      res.send(500, err);
    }else{
      res.send(200, newUser);
    }
  });
});

app.post('/api/v1/tutor/', function(req, res){

  tutorManager.registerTutor(req, function(err, data){
      if(err){
        res.send(500, err);
      }else{
        userManager.updateTutor(data, function(err2, data2){

          if(err2){
            res.send(500, err2);
          }else{
            res.send(200, data2);
          }
       });
     }
  });
});

app.get('/api/v1/tutor/id/', function (req, res) {
  tutorManager.getTutor(req.user.id, function(err, data){
    if(err){
      res.send(500, err);
    }else{
      
      var tags = [];

      for (var i = 0, tag; tag = data.tags[i]; i++) {
        tags.push(tag);
      }

      tagManager.getTags(tags, function (err , tags) {
        if (err) {
          res.send(500);
        } else {

          data._doc.tags = [];

          for (var i = 0, tag; tag = tags[i]; i++) {
            data._doc.tags.push(tag._doc);
          }

          res.send(200, data);
        }
      })
    }
  });
});

app.put('/api/v1/tutor/', function(req, res){

  tutorManager.updateTutor(req, function(err, data){
      if(err){
        res.send(500, err);
      }else{
        
     }
  });
});

app.post('/api/v1/question/', function (req, res) {

  console.log("Received a new question");

  var questionToBeAsked = req.body;



  // questionManager.askQuestion(questionToBeAsked,req,res, function(err, savedQuestion){
  //   if(err){
  //     res.send(500, err);
  //   }else{

      var question = {};

      question.question = questionToBeAsked;
      var studentId = req.user._doc._id;

      question.studentId = studentId;

      var pendingQuestion = {'question': question, tutors: []};


      var availableTutorsWithTags = getAllMatchedTutors(question);

      pendingQuestion.tutors = availableTutorsWithTags;

      pendingQuestions[studentId]=pendingQuestion;

      // contactTutor(studentId); // do this only when student is ready on client side

      res.send(200);
      // TODO: pending questions,  emit from student that he is ready to move onto  available questions,
    // }
  // });
});

function getAllMatchedTutors(question){
  var matchedTutorList = [];
  for(var tutorId in availableTutorList){
    var tutor = availableTutorList[tutorId].tutor;

    if(matchTutor(tutor, question)){
      matchedTutorList.push(tutor);
    }
  }
  return matchedTutorList;
}

function matchTutor (tutor, question){
  
  var tags = question.question.tags;

  for(var i=0; i<tags.length;i++){
    for(var j=0; j<tutor.tags.length;j++){
      if(tags[i]==tutor.tags[j]){
        return true;
      }
    }
  }
  return false;
}


function contactTutor(studentId){

  console.log("Attempting to contact tutor");

  var availableQuestion = getAvailableQuestionFromStudent(studentId);

  if(availableQuestion !=null){
    if(availableQuestion.tutors.length > 0 ){
      for(var i = 0; i< availableQuestion.tutors.length; i++ ){
      //todo: check if exist tutor and refactor method
        var tutor = availableQuestion.tutors[i];

        if(tutorIsAvailable(tutor.userId)){
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
  var allTags = tagManager.getAllTags(function(err, data){
    if(err){
      res.send(500, err);
    }else{
      res.send(200, data);
    }
  });
});

app.get('/api/v1/tag/:input', function ( req ,res ) {

  var input = req.params.input;

  var allTags = tagManager.searchForTags(input, function(err, data){
    if(err){
      res.send(500, err);
    }else{
      res.send(200, data);
    }
  });
});


app.post('/api/v1/tag/', function ( req ,res ) {
  var newTag = tagManager.createTag(req, function(err, data){
    if(err){
      res.send(500, err);
    }else{
      res.send(200, data);
    }
  });
});

app.get('/api/v1/dev/tools/connectedUser', function (req, res) {

  res.send(200, people)
  
})

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
var pendingQuestions   = {};
var availableTutorList = {};

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


    var user = people[clientSocket.id];
    user.isAvailable = true;

    tutorManager.getTutor(user.userId, function(err, data){
      if(err){
        res.send(500, err);
      }else{
        var tutor = {};

        tutor.userId = user.userId;

        var tags = [];

        for (var i = 0, tag; tag = data.tags[i]; i++) {
          tags.push(tag);
        }

        tagManager.getTags(tags, function (err , tags) {
          if (err) {
            res.send(500);
          } else {

            tutor.tags = [];

            for (var i = 0, tag; tag = tags[i]; i++) {
              tutor.tags.push(tag._doc.tag);
            }

            var tutorMatching = {tutor: tutor};
            var questionList = [];

            for(var studentId in availableQuestions){
              var question = availableQuestions[studentId].question;
              if(matchTutor(tutor, question)){
                questionList.push(question);
                availableQuestions[studentId].tutors.push(user.userId);

                //if available qst tutor list empty -> contact tutor
              }
            }

            tutorMatching.questions = questionList;

            availableTutorList[user.userId] = tutorMatching;
          }
        })
      }
    });

    // tutorManager.getTutor(user.userId, function(err, tutorModel){
    //   if(err){

    //   }else{
    //     var tutorMatching = {tutor: tutorModel};


    //   }
    // });

    
  });

  clientSocket.on('availability-off', function () {

    var user = people[clientSocket.id];
    user.isAvailable = false;

    var tutorQuestions = availableTutorList[user.userId];

    for(var i = 0; i<tutorQuestions.questions.length;i++){
      removeTutorFromQuestion(tutorQuestions.questions[i].studentId, user.userId);
    }

    delete availableTutorList[user.userId];
  });

  clientSocket.on('tutorResponse', function(response){
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

  clientSocket.on('studentReady', function(response){

    var userId = people[clientSocket.id].userId;

    availableQuestions[userId] = pendingQuestions[userId];

    contactTutor(userId);

    pendingQuestions[userId] = null;

  });

  clientSocket.on('studentResponse', function(response){
    var studentId = response.studentId;
    var tutorId = response.tutorId;
    
    if(response.response == 0){

      //join tutor room for whiteboard

      socket.sockets.in(studentId).emit("wbReady", {});
      socket.sockets.in(tutorId).emit("wbReady", {});

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
