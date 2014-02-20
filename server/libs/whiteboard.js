var socket = null
  , client = null;

exports.init = function(sckt, clientSocket) {
	socket = sckt;
	client = clientSocket;

	client.join('bigWB');

	socket.sockets.in('bigWB').emit('new-artist');

	client.on('drawing:progress', function (data) {
		socket.sockets.in('bigWB').emit('drawing:progress', { id : data.id, path: data.path});
	});

	client.on('drawing:end', function (data) {
		socket.sockets.in('bigWB').emit('drawing:end', { id : data.id, path: data.path});
		socket.sockets.in('bigWB').emit('new-artist');

	});
}