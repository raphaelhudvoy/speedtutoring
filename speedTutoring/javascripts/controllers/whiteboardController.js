Tuto.controller('whiteboardController', ['WebSocketFactory', 'UserService', function (WebSocketFactory, UserService) {
	var controller = this;

	this.chat = {};

	this.chat.msg = [];
	this.chat.input = "";

	this.send_msg = function () {

		UserService.getCurrentUserId().then(function (id) { 

			WebSocketFactory.emit('chat:send', {
				user : id, msg : controller.chat.input
			}, function () {
				controller.chat.input = "";
			})
			
		}, function (err) {
			console.log('not able to send msg');
		})
	}
	

	WebSocketFactory.receive('chat:newMsg', function (msg) {
		UserService.getCurrentUserId().then(function (id) {
			if (msg.user == id) {
				msg.user = 1;
			} else {
				msg.user = 0;
			}

			controller.chat.msg.push(msg);

			$("#chat").scrollTop($("#chat")[0].scrollHeight);
		})
	})
	
}]);