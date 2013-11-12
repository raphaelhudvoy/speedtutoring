Tuto.factory('UserService', function ($http, $q) {

	var Service = {};

	function NewRegisterUser (user) {
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

	function LoginUser (user) {
		if (!user) {
			user = {}
		}

		this.type = "loginUser"; // Do not modify

		this.username = user.username || "";
		this.password = user.password || "";

	}

	LoginUser.prototype.submit = function () {
		var deferred = $q.defer();

		var url =  "/api/v1/login/";

<<<<<<< HEAD

		$http.post(url, this).success(function (results) {
			deferred.resolve();
		}).error(function (results) {
			deferred.reject(results);
=======
		$http.post(url, this).success(function (results) {
			$q.resolve();
		}).error(function (results) {
			$q.reject(results);
>>>>>>> 3a156ea8e52c3e2daa5d175d0e57228874528fef
		});

		return deferred.promise;
	}


	Service.dumpUserDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$http.get(url).success(function(response){
			console.log("GET COMPLETE");
			console.log(response);
			return response;
		});
	}

	Service.getLoginUser = function () {
		return new LoginUser();
	}

	Service.getNewRegisterUser = function () {
		return new NewRegisterUser();
	}


	return Service;

});