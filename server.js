'use strict';

var express = require('express'),
    socketIO = require('socket.io'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');
  
// Passport Configuration
var passport = require('./lib/config/passport');

var app = express();
var server = http.createServer(app);
var io = socketIO.listen(server);

var people             = {};
var availableQuestions = {};
var tutorList          = {};

io.sockets.on('connection', function (clientSocket) {

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



// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;