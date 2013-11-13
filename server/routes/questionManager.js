var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
  question:  String,
  tags: [mongoose.ObjectId]
});

var Question = mongoose.model('Question', questionSchema);

exports.askQuestion = function (q, res) {

	var question = new Question(q);

	var promise = new mongoose.Promise;

	question.save(function (err) {
	  	  if (err){
		  	promise.resolve(err);
		  }else{
		  	promise.resolve(null, question);
		  }
	});

	return promise;
};

exports.dumpQuestionDatabase = function (req, res) {

	Question.find({}, function (err, questions) {

         var questionMap = {};
         questions.forEach(function(question) {
              questionMap[question._id] = question;
         });
         res.send(questionMap);
   });
};