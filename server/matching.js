function contactTutor(studentId){
  var availableQuestion = getAvailableQuestionFromStudent(studentId);
  if(availableQuestion !=null){
    if(availableQuestion.tutors.length > 0 ){
      for(var i = 0; i< availableQuestion.tutors.length; i++ ){
      //todo: check if exist tutor and refactor method
        tutor = availableQuestion.tutors[i];
        if(isAvailable(tutor.userId)){
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
  if(tutorList != null){
    if(tutorList[tutorId] !=null){
      return true;
    }
  }
  return false;
}

function getAvailableQuestionFromStudent(studentId){
  if(studentId){
    if(availableQuestions.length >0){
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