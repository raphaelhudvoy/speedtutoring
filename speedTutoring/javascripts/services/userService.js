Tuto.factory('UserService', function ($http, $q) {

	var Service = {};

	function User (user) {
		if (!user) {
			user = {};
		}

		this.type 		= "registerUser"; // Do not modify

		this.firstName 	= user.firstName 	|| "";
		this.lastName 	= user.lastName 	|| "";
		this.username 	= user.username 	|| "";
		this.password  	= user.password		|| ""
		this.email 		= user.email 		|| "";

	}

	NewRegisterUser.prototype.submit = function () {

		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$http.post(url, this).success(function (results){
			deferred.resolve(results);
		}).error(function (results) {
			deferred.reject(results);
		});

		return deferred.promise;

	}


	Service.registerUser = function (user) {

		user = new User(user);

		var deferred = $q.defer();

		var url = "/api/v1/user/";


		$http.post(url, this).success(function (results) {
			deferred.resolve();
		}).error(function (results) {
			deferred.reject(results);
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