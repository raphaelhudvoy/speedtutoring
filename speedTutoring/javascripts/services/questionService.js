Tuto.factory('QuestionService', function ($http, $q) {

	var Service = {};

	function Question (question) {
		if (!question) {
			question = {};
		}
		this.userId = question.userId || "";
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

	Service.viewQuestions = function(userId){
		var url = "/api/v1/user/"+userId+"/questions";
		$http.get(url).success(function(questions){
			console.log(questions);
		});
	}

	Service.dumpQuestionDatabase = function(){
		var deferred = $q.defer();

		var url = "/api/v1/question/";

		$http.get(url).success(function(response){
			//console.log("QUESTION GET COMPLETE");
			//console.log(response);
			return response;
		});
	}


	return Service;

});