Tuto.factory('TagService', function ($http, $q) {

	var Service = {};

	function Tag (tag) {
		if (!user) {
			user = {}
		}

		this.id = tag.id || "";
		this.tag = tag.tag || "";
		this.type = tag.type || "";
	}


	Service.getAllTags = function () {

		var deferred = $q.defer();
		var url = "/api/v1/tag/";

		$http.get(url).success(function(response){
			deferred.resolve(response);
		}).error(function(err){
			deferred.reject(err);
		});

		return deferred.promise;

	};


	return Service;

});