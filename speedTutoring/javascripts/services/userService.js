Tuto.factory('UserService', function ($http, $q) {

	var Service = {};

	function User (user) {
		if (!user) {
			user = {};
		}

		this.firstName 	= user.firstName 	|| "Pat";
		this.lastName 	= user.lastName 	|| "Dube";
		this.username 	= user.username 	|| "pdube";
		this.email = user.email || "m@mcgill.ca";

	}


	Service.registerUser = function (user) {

		user = new User(user);

		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$http.post(url, user).success(function(res){
			console.log("POST COMPLETE");
		});

	};

	Service.dumpUserDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$http.get(url).success(function(response){
			console.log("GET COMPLETE");
			console.log(response);
			return response;
		});
	}


	return Service;

});