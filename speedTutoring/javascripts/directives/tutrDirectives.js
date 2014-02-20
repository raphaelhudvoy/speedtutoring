Tuto.directive('tutrCanvas', function () {
	return {
		restrict: 'A',
        controller : function (WebSocketFactory) {

            // Connect socket with server
            var socketId = null;

            WebSocketFactory.emit('join-wb-room', {}, function (id) {
                socketId = id;
            });

            WebSocketFactory.receive('new-artist', function () {
                console.log('new artits');
            });

            // Utility functions for drawing
            var canvas = null
              , offLeft = 0
              , offTop = 0
              , path = {}
              , pathToSend = {}
              , color = 'black'
              , timer;

            this.init = function (elm) {

                // Init Paper.js
                paper.setup(elm);

                // Init canvas
                canvas = elm;
                offLeft = canvas.offsetLeft;
                offTop  = canvas.offsetTop;

                // Init path
                path = new paper.Path();
                path.strokeColor = color;
            };

            this.onMouseDown = function (event) {

                var point = new paper.Point(event.x - offLeft, event.y - offTop);

                path = new paper.Path();
                path.strokeColor = color;

                path.add(point);

                // Initialize the new path that will be send 
                pathToSend = {
                    color : color,
                    start : point,
                    path : []
                };

                // Send path every 100ms
                timer = setInterval( function() {

                    WebSocketFactory.emit('drawing-progress', JSON.stringify(pathToSend));
                    pathToSend.path = new Array();
                }, 100);
            }

            this.onMouseDrag = function (event) {
    
                var point = new paper.Point(event.x - offLeft, event.y - offTop);

                path.add(point);
                path.smooth();

                pathToSend.path.push(point);

                
            };

            this.onMouseUp = function (event) {

                var point = new paper.Point(event.x - offLeft, event.y - offTop);
                path.add(point);

                pathToSend.end = point;
                WebSocketFactory.emit('drawing-end', JSON.stringify(pathToSend));

                clearInterval(timer);
                path.smooth();
            };

            // External path (other user) handling
            var externalPath = {};

            WebSocketFactory.receive('drawing-progress', function (user, path) {
                if (user != socketId && path) {
                    drawPath(path, user);
                }
            });

            WebSocketFactory.receive('drawing-end', function (user, path) {
                if (user != socketId && path) {
                    endPath(path, user);
                }
            });

            function drawPath (path, user) {

                var path = externalPath[user];

                // Path is not started yet
                if (!path) {

                    // Init path
                    externalPath[user] = new paper.Path();
                    path = externalPath[user];

                    //Start path
                    path.add(path.start);
                }

                // Draw path points
                for (var i = 0, point; point = path.path[i]; i++) {
                    path.add(point);
                }

                path.smooth();

                paper.view.draw();
            };

            function endPath (path, user) {
                var path = externalPath[user];

                if (path) {
                    path.add(path.end);
                    path.smooth();

                    externalPath[user] = false;
                }
            }


        },
        link: function(scope, elm, attrs, ctrl) {


            ctrl.init(elm[0]);

            elm.on('mousedown', function (event) {
                ctrl.onMouseDown(event);

                elm.on('mousemove', function (event) {
                    ctrl.onMouseDrag(event);
                });

                elm.on('mouseup', function (event) {
                    ctrl.onMouseUp(event);
                    elm.unbind('mousemove');
                    elm.unbind('mouseup');
                });
            });

        }
	}
});