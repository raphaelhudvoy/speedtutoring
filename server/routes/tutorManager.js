var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tutorSchema = new Schema({
  userId:  {type:Schema.ObjectId, required:true, unique:true},
  tags: [Schema.ObjectId] 
});

var Tutor = mongoose.model('Tutor', tutorSchema);

exports.registerTutor = function(req, res){
	var tutor = new Tutor(req.body);


	var promise = Mongoose.Promise;
	tutor.save(function (err) {
	  if (err){
	  	promise.resolve(err);
	  }else{
	  	promise.resolve(null, tutor);
	  }
	  
	});
	return promise;
}