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
		this.school 	= user.school 		|| "";

	}

	NewRegisterUser.prototype.submit = function () {

		var deferred = $q.defer();

		var url = "/api/v1/user/";


		$http.post(url, this).success(function (results){
			window.location = "login";
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
			window.location = "home";
			deferred.resolve(results);
		}).error(function (results) {
			deferred.reject(results);
		});

		return deferred.promise;
	}

	Service.getLoginUser = function () {
		return new LoginUser();
	}

	Service.getNewRegisterUser = function () {
		return new NewRegisterUser();
	}

	Service.getCurrentUserId = function () {
		var deferred = $q.defer();

		var url =  "/api/v1/user/id/";

		$http.get(url, this).success(function (user) {
			deferred.resolve(user._id);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}

	Service.isCurrentUserATutor = function () {
		var deferred = $q.defer();

		var url =  "/api/v1/user/isTutor";

		$http.get(url, this).success(function (isTutor) {
			deferred.resolve(isTutor);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	}


	return Service;

});