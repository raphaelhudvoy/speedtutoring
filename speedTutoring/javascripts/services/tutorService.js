Tuto.factory('TutorService', function ($http, $q) {

	var Service = {};

	function Tutor (tutor) {
		if (!tutor) {
			tutor = {};
		}

		this.title 	= tutor.title 	|| "Pat";
		this.tags = tutor.tags || [];

	}

	Service.registerTutor = function (tutor) {

		tutor = new Tutor(tutor);

		var deferred = $q.defer();

		var url = "/api/v1/tutor/";

		$http.post(url, tutor).success(function(res){
			console.log("TUTOR POST COMPLETE");
		});

	};

	return Service;

});