Tuto.factory('UserService', function ($http, $q) {

	var Service = {};

	function User (user) {
		if (!user) {
			user = {}
		}

		this.firstName 	= user.firstName 	| "Pat";
		this.lastName 	= user.lastName 	| "Dube";
		this.password 	= user.password 	| "caca";
		this.username 	= user.username 	| "pdube";
	}


	Service.registerUser = function (user) {

		user = new User(user);

		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$$http('POST', url, user, function(status, response){
			// success


		}, function(status, response){
			// error

		});


	};


	return Service;

});