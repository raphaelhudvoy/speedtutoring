Tuto.controller('studentMatchingController', ['$scope','$location', 'WebSocketFactory', '$modal', function ($scope, $location, WebSocketFactory, $modal) {

	var vm = {};
	$scope.vm = vm;

	WebSocketFactory.receive('foundTutor', function(data){
		console.log("found a tutor");
		var modalInstance = $modal.open({
	      templateUrl: 'views/foundTutor.ejs',
	      controller: foundTutorCtrl,
	      backdrop : 'static',
	      resolve: {
	        availableQuestion: function () {
	          return data;
	        }
	      }
	    });

	    modalInstance.result.then(function (response) {
			WebSocketFactory.emit('studentResponse', response);

	    }, function () {
	     //
	    });
	});


	WebSocketFactory.receive('wbReady', function(data){
		$location.path("/whiteboard");
	});

	var foundTutorCtrl = function ($scope, $modalInstance, availableQuestion) {

	  $scope.question = availableQuestion;
	  $scope.response = {};
	  $scope.response.question = $scope.question;
	  
	  $scope.yes = function () {
	  	
	  	$scope.response.response = 0;

	    $modalInstance.close($scope.response);
	  };

	  $scope.no = function () {
	  	$scope.response.response = 1;

	    $modalInstance.close($scope.response);
	  };
	};
	
	WebSocketFactory.emit('studentReady', {});
}]);
