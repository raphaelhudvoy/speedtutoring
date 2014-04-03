var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
  question: {type:String, required:true} ,
  userId: {
  	type:Schema.ObjectId,
  	required : true
  },
  tags: [Schema.ObjectId]
});

var Question = mongoose.model('Question', questionSchema);

exports.askQuestion = function (q, req, res, cb) {

	q.userId = req.user._doc._id;

	var question = new Question(q);

	question.save(function (err) {
	  	  if (err){
		  	cb(err);
		  }else{
		  	cb(null, question);
		  }
	});
};


exports.viewQuestions = function (uId) {
	var promise = new mongoose.Promise;

	Question.find({userId: uId},function (err, docs) {
	  	  if (err){
		  	promise.resolve(err);
		  }else{
		  	var questions = [];
		  	docs.forEach(function(doc){
		  		questions.push(doc._doc);
		  	})


		  	promise.resolve(null, questions);
		  }
	});

	return promise;
};