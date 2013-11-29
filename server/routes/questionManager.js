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