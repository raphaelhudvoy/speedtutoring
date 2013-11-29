var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tutorSchema = new Schema({
  userId:  {type:Schema.ObjectId, required:true, unique:true},
  tags: [Schema.ObjectId] 
});

var Tutor = mongoose.model('Tutor', tutorSchema);

exports.registerTutor = function(req){
	var tutorObj = req.body;
	var promise = new mongoose.Promise;

	var tags = [];


	tutorObj.tags.forEach(function(tag){
		tags.push(mongoose.Types.ObjectId(tag._id));
	});

	tutorObj.userId = req.user._doc._id;
	tutorObj.tags = tags;

	var tutor = new Tutor(tutorObj);

	tutor.save(function (err) {
	  if (err){
	  	promise.resolve(err);
	  }else{
	  	promise.resolve(null, tutor);
	  }
	  
	});

	return promise;
}

exports.getInfo = function(uId){

	var promise = new mongoose.Promise;

	Tutor.findOne({userId: mongoose.Types.ObjectId(uId)}, function(err, tutor){
		if(err){
			promise.resolve(err);
		}else{
			promise.resolve(null, tutor.tags);
		}
	});

	return promise;
}