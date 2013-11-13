var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username:{
		type	: String,
		unique	: true
	}
  ,
  firstName		: {type:String},
  lastName		: {type:String},
  email 		: {type:String},
  password 		: {type:String}
});

var User = mongoose.model('User', userSchema);

exports.createUser = function (req, res) {
	var user = new User(req.body);

	var promise = new mongoose.Promise;

	user.save(function (err) {
		if (err){
			promise.resolve(err);
		}else{
			promise.resolve(null, user);
		}
	});
	return promise;
};

exports.findUserByUsername = function (username) {
	
	User.find({'firstName' : username }, function (err, user) {
		if (err) {
			promise.resolve(err);
		} else {
			promise.resolve(null, user);
		}
	});

	return promise;
}

exports.dumpUserDatabase = function (req, res) {

	User.find({}, function (err, users) {

         var userMap = {};
         users.forEach(function(user) {
              userMap[user._id] = user;
         });
         res.send(userMap);
   });
};