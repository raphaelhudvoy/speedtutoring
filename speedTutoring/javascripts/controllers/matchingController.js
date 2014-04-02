Tuto.controller('matchingController', ['$scope', 'WebSocketFactory', '$modal', function ($scope, WebSocketFactory, $modal) {

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
	      availableQuestion.response = response;
			WebSocketFactory.emit('tutorResponse', vm.availableQuestion);

	    }, function () {
	     //
	    });
	});

	WebSocketFactory.receive('foundTutor', function(data){
		console.log("found a tutor");
		vm.displayTutorAccept(data);
	});

	vm.displayAvailableQuestion = function(question){
		vm.availableQuestion = question;
		vm.askStep =3;
	};

	vm.displayTutorAccept = function(tutor){
		vm.tutorAvailable = tutor;
		vm.askStep =4;
	};

	vm.tutorResponse = function(response){
		vm.availableQuestion.response = response;
		WebSocketFactory.emit('tutorResponse', vm.availableQuestion);
	};

	vm.studentResponse = function(response){

		//TODO: check response from student
		if(response)
		$location.path("/whiteboard");
		// vm.tutorAvailable.response = response;
		// WebSocketFactory.emit('tutorResponse', vm.tutorAvailable);
		// vm.askStep =5;
	};


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
}]);
