var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tutorSchema = new Schema({
  userId:  {type:Schema.ObjectId, required:true, unique:true},
  tags: [Schema.ObjectId] 
});

var Tutor = mongoose.model('Tutor', tutorSchema);

exports.registerTutor = function(req, cb){
	var tutorObj = req.body;

	var tags = [];


	tutorObj.tags.forEach(function(tag){
		tags.push(mongoose.Types.ObjectId(tag._id));
	});

	tutorObj.userId = req.user._doc._id;
	tutorObj.tags = tags;

	var tutor = new Tutor(tutorObj);

	tutor.save(function (err) {
	  if (err){
	  	cb(err);
	  }else{
	  	cb(null, tutor);
	  }
	  
	});
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

exports.getAllTutors = function(){

	var promise = new mongoose.Promise;

	Tutor.find({}, function(err, tutors){
      if(err){
          promise.resolve(err);
      }else{
          promise.resolve(null, tutors);
      }
  });

	return promise;
}

exports.updateTutor = function(req, cb){

	var tutorObj = req.body;

	var tags = [];


	tutorObj.tags.forEach(function(tag){
		tags.push(mongoose.Types.ObjectId(tag._id));
	});

	tutorObj.userId = req.user._doc._id;
	tutorObj.tags = tags;

	var tutor = new Tutor(tutorObj);

	tutor.save(function (err) {
	  if (err){
	  	cb(err);
	  }else{
	  	cb(null, tutor);
	  }
	  
	});
}

exports.getTutor = function(userId, cb){
	Tutor.findOne({userId: mongoose.Types.ObjectId(userId)}, function(err, tutor){
		if(err){
			cb(err);
		}else{
			cb(null, tutor);
		}
	});
}