Tuto.factory('TagService', function ($http, $q) {

	var Service = {};

	function Tag (tag) {
		if (!tag) {
			tag = {}
		}

		this.id = "";
		this.tag = tag.tag || "";
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

	Service.createTag = function(tag, cb){

		console.log(tag);
		var newTag = {};

		newTag.tag = tag;

		var tagModel = new Tag(newTag);

		var deferred = $q.defer();
		var url = "/api/v1/tag/";

		$http.post(url, tagModel).success(function(response){
			cb(null, response);
		}).error(function(err){
			cb(err);
		});
	};


	return Service;

});