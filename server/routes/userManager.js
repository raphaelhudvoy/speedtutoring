var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	tutorId: {type:Schema.ObjectId},
	username:{
		type	: String,
		unique	: true	},
	firstName		: {type:String},
	lastName		: {type:String},
	location 		: {type:String},
	created 		: {type: Date}
});

var User = mongoose.model('User', userSchema);

exports.findById = function (id, done) {
	User.findById(id, function(err, user){
		if(!err) done(null, user);
		else done(err, null);
	})
}

exports.logUser = function (profile, done) {

	User.findById(profile.id, function(err, user) {
	    if(err) { console.log(err); }
	    if (!err && user != null) {
	    	done(null, user);
	    } else {
	    	var id = profile.id.toString(16);
	    	


			var user = new User({
				_id: mongoose.Types.ObjectId(id),
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				location: profile._json.location.name,
				created: Date.now()
			});
			user.save(function(err) {
				if(err) {
				 	console.log(err);
				} else {
					  console.log("saving user ...");
					  done(null, user);
				};
			});
	    };
	});
};

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
	
	User.find({'username' : username }, function (err, user) {
		if (err) {
			promise.resolve(err);
		} else {
			promise.resolve(null, user);
		}
	});

	return promise;
}