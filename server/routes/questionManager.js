

exports.askQuestion = function (Question, req, res) {

	var question = new Question(req.body);

	question.save(function (err) {
	  if (err){
	  	//fuuuuuu
	  }
	  // saved!
	});
	return res.json({test:question});
};

exports.dumpQuestionDatabase = function (Question, req, res) {

	Question.find({}, function (err, users) {

         var userMap = {};
         users.forEach(function(question) {
              userMap[question._id] = question;
         });
         res.send(userMap);
   });
};