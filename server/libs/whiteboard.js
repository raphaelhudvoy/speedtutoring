var socket = null
  , client = null;

exports.init = function(sckt, clientSocket) {
	socket = sckt;
	client = clientSocket;

	client.join('bigWB');

	socket.sockets.in('bigWB').emit('new-artist');

	client.on('drawing-progress', function (path) {
		socket.sockets.in('bigWB').emit('drawing-progress', client.id, path)
	});

	client.on('drawing-end', function (path) {
		socket.sockets.in('bigWB').emit('drawing-progress', client.id, path)
	});
}