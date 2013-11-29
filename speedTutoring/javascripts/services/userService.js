Tuto.factory('UserService', function ($http, $q, $location) {

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

		$http.post(url, this).success(function (results) {
			$location.path("home");
			deferred.resolve(results);
		}).error(function (results) {
			deferred.reject(results);
		});

		return deferred.promise;
	}


	Service.dumpUserDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/user/";

		$http.get(url).success(function(response){
			//console.log(response);
			return response;
		});
	}

	Service.getLoginUser = function () {
		return new LoginUser();
	}

	Service.getNewRegisterUser = function () {
		return new NewRegisterUser();
	}

	Service.getCurrentUserId = function () {
		var deferred = $q.defer();

		var url =  "/api/v1/user/id";

		$http.get(url, this).success(function (userId) {
			deferred.resolve(userID);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}


	return Service;

});