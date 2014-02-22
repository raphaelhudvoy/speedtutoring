Tuto.directive('wbColors', function () {
    return {
        restrict : 'A', 
        controller : function ($scope) {
            var colorPickers = [];
            var counter = 0;

            this.saveElement = function (elm, index) {
                counter = counter + 1;
                var length = colorPickers.push(elm);
                return length - 1;
            }

            this.selectColor = function (index) {
                for (var i = 0, element; element = colorPickers[i]; i++) {
                    if (i == index) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                }
            }

            $scope.colors = ['#FFF432', '#FFA432', '#BFF432'];
        }
    }
})


Tuto.directive('wbSelectColor', function () {
    return {
        priority: 1000,
        restrict: 'A',
        require:'^wbColors',
        link : function (scope, elm, attrs, ctrl) {

            var index = ctrl.saveElement(elm, index);

            elm.on('click', function () {
                ctrl.selectColor(index);
            });

        }
    }
});


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

                    WebSocketFactory.emit('drawing:progress', {path : JSON.stringify(pathToSend), id : socketId});
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
                WebSocketFactory.emit('drawing:end', {path : JSON.stringify(pathToSend), id : socketId});

                clearInterval(timer);
                path.smooth();
            };

            // External path (other user) handling
            var externalPath = {};

            WebSocketFactory.receive('drawing:progress', function (data) {
                var user = data.id
                  , path = data.path;

                console.log('drawing');

                if (user != socketId && path) {
                    drawPath(JSON.parse(path), user);
                }
            });

            WebSocketFactory.receive('drawing:end', function (data) {
                var user = data.id
                  , path = data.path;

                console.log('end-drawing');

                if (user != socketId && path) {
                    endPath(JSON.parse(path), user);
                }
            });

            function drawPath (data, user) {

                var path = externalPath[user];

                // Path is not started yet
                if (!path) {

                    // Init path
                    externalPath[user] = new paper.Path();
                    path = externalPath[user];

                    //Start path
                    path.strokeColor = data.color;
                    path.add(new paper.Point(data.start[1], data.start[2]));
                }

                // Draw path points
                for (var i = 0, point; point = data.path[i]; i++) {
                    path.add(new paper.Point(point[1], point[2]));
                }

                path.smooth();

                paper.view.draw();
            };

            function endPath (data, user) {
                var path = externalPath[user];

                if (path) {
                    path.add(new paper.Point(data.end[1], data.end[2]));
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