

exports.createUser = function (User, req, res) {

	var user = new User(req.body);

	user.save(function (err) {
	  if (err){
	  	//fuuuuuu
	  }
	  // saved!
	});
	return res.json({test:user});
};

exports.dumpUserDatabase = function (User, req, res) {

	User.find({}, function (err, users) {

         var userMap = {};
         users.forEach(function(user) {
              userMap[user._id] = user;
         });
         res.send(userMap);
   });
};