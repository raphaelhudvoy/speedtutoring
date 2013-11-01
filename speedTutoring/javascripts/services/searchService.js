Tuto.factory('SearchService', function ($http, $q) {

	var Service = {};

	function Tags (tag) {
		if (!user) {
			user = {}
		}

		this.tagId = tag.tagId | undefined;
		this.title = tag.title | "";
	}


	Service.searchForTags = function (input) {

		var deferred = $q.defer();

		var url = "/api/v1/search/tag/";

		// $http('GET', url, function(status, response){

		// 	console.log("GET SUCCESS");
		// 	// success
		// }, function(status, response){
		// 	// error
		// });

		var tags = [ { tagID : 1, title: "Math"}
					,{ tagID : 2, title: "English"}
					,{ tagID : 3, title: "Art"}
					,{ tagID : 4, title: "Computer"}
					,{ tagID : 5, title: "Internet"}
					,{ tagID : 6, title: "Electricity"}
					,{ tagID : 7, title: "Algebra"}]

		deferred.resolve(tags);

		return deferred.promise;
	};


	return Service;

});