Tuto.controller('tutorMatchingController', ['$scope', '$location','WebSocketFactory', '$modal', function ($scope, $location, WebSocketFactory, $modal) {

	var vm = {};
	$scope.vm = vm;


	WebSocketFactory.receive('newQuestion', function(data){
		console.log("received question");
		
		var modalInstance = $modal.open({
	      templateUrl: 'views/newQuestion.ejs',
	      controller: newQuestionCtrl,
	      backdrop : 'static',
	      resolve: {
	        availableQuestion: function () {
	          return data;
	        }
	      }
	    });

	    modalInstance.result.then(function (response) {
			WebSocketFactory.emit('tutorResponse', response);

	    }, function () {
	     //
	    });
	});

	WebSocketFactory.receive('wbReady', function(data){
		$location.path("/whiteboard");
	});


	var newQuestionCtrl = function ($scope, $modalInstance, availableQuestion) {

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
	
	WebSocketFactory.emit('tutorReady', {});
}]);
