Tuto.factory('QuestionService', function ($http, $q) {

	var Service = {};

	function Question (question) {
		if (!question) {
			question = {};
		}

		this.question 	= question.question 	|| "?";
		this.tags 	= question.tags 	|| [];

	}


	Service.askQuestion = function (question) {

		question = new Question(question);

		var deferred = $q.defer();

		var url = "/api/v1/question/";

		$http.post(url, question).success(function(res){
			console.log("POST OF QUESTION COMPLETE");
		});

	};

	Service.dumpQuestionDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/question/";

		$http.get(url).success(function(response){
			console.log("QUESTION GET COMPLETE");
			console.log(response);
			return response;
		});
	}


	return Service;

});