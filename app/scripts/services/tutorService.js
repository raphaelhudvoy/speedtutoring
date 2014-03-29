angular.module('speedtutoringApp').factory('TutorService', function ($http, $q) {

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

	return Service;

});


angular.module('speedtutoringApp').factory('WBService', function () {

	var Service = {};

	Service.params = {
		color 	: 'black',
		stroke 	: 1
	};

	Service.setColor = function (color) {
		Service.params.color = color;
	}

	return Service;

});