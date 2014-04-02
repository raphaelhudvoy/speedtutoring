Tuto.controller('tutorController', ['$scope','WebSocketFactory', 'TagService', 'UserService', 'TutorService' , function ($scope, WebSocketFactory, TagService, UserService, TutorService) {

	var vm = {};
	$scope.vm = vm;
	vm.allTags=[];
	vm.myTags=[];
	vm.newTag="";

	vm.createTag = function(tag){
		TagService.createTag(tag, function(err, newTag){
			if(err){
				
			}else{
				vm.newTag="";
				vm.myTags.push(newTag);
				TagService.getAllTags().then(function(tags){
					vm.allTags = tags;
				});
			}
		});
	}

	vm.addTag = function(tag){
		var flag = false;
		for(var i=0; i<vm.myTags.length; i++){
			if(vm.myTags[i].tag == tag.tag){
				flag =true;
				break;
			}
		}
		if(!flag){
			vm.myTags.push(tag);
		}
	}

	vm.removeTag = function(tag){
		for(var i=0; i<vm.myTags.length; i++){
			if(vm.myTags[i].tag == tag.tag){
				vm.myTags.splice(i,1);
			}
		}
	}

	vm.saveSettings = function(){
		
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){
					TutorService.updateTutor(tutorId, vm.myTags, function(err, data){
						if(err){
							console.log(err);
						}else{

						}
					});
				}else{
					var newTutor = {};
					newTutor.userId = user.id;
					newTutor.tags = vm.myTags;

					TutorService.registerTutor(newTutor, function(err, data){
						if(err){
							console.log(err);
						}else{

						}
					});
				}
			}
		});
	}

	TagService.getAllTags().then(function(tags){
		vm.allTags = tags;
	});

	getTags = function(){
		console.log("IN GET TAGS FOR TUTORS");
		UserService.getCurrentUser(function(err, user){
			var tutorId = user.tutorId;
			if(err){
				console.log(err);
			}else{
				if(tutorId){
					TutorService.getTutor(function(err, data){
						if(err){
							console.log(err);
						}else{
							vm.myTags = data.tags;
						}
					});
				}
			}
		});
	}

	getTags();

	
}]);