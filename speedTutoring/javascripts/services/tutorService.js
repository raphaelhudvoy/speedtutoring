Tuto.factory('TutorService', function ($http, $q) {

	var Service = {};

	function Tutor (tutor) {
		if (!tutor) {
			tutor = {};
		}
		this.tags = tutor.tags || [];

	}

	Service.registerTutor = function (tutor) {

		tutor = new Tutor(tutor);

		var deferred = $q.defer();

		var url = "/api/v1/tutor/";


		$http.post(url, tutor).success(function (registeredTutor) {
			deferred.resolve(registeredTutor);
		}).error(function (err) {
			deferred.reject(err);
		});

		return deferred.promise;
	};

	Service.updateTutor = function(tutorId, tags, cb){
		var url = "/api/v1/tutor/";

		var tutor = {};
		tutor.tutorId = tutorId;
		tutor.tags = tags;

		$http.put(url, tutor).success(function (updatedTutor) {
			cb(null, updatedTutor);
		}).error(function (err) {
			cb(err);
		});
	}

	// Service.updateTutor = function(tutor, cb){

	// 	var url = "/api/v1/tutor/";


	// 	$http.put(url, tutor).success(function (updatedTutor) {
	// 		cb(null, updatedTutor);
	// 	}).error(function (err) {
	// 		cb(err);
	// 	});
	// }

	return Service;

});