Tuto.directive('wbColors', function () {
    return {
        restrict : 'A', 
        controller : function ($scope, WBService) {
            var colorPickers = [];

            this.saveElement = function (elm) {
                var length = colorPickers.push(elm);
                return length - 1;
            }

            this.selectColor = function (index) {
                for (var i = 0, element; element = colorPickers[i]; i++) {
                    if (i == index) {
                        WBService.setColor($scope.colors[index]);
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                }
            }

        },
        link : function (scope, elm, attrs, ctrl) {
            var pickers = elm.find("button");

            scope.colors = [];

            for (var i = 0, picker; picker = pickers[i]; i++ ) {
                scope.colors[i] = picker.attributes['wb-select-color'].value;
            }
        }
    }
});

Tuto.directive('wbSlider', function () {
    return {
        controller : function (WBService) {

            var params = WBService.params;

            this.slide = function (value) {
                params.stroke = value;
            }
        },
        link: function (scope, elm, attrs, ctrl) {

            elm.slider({
                formater: function(value) {
                    return 'Current value: ' + value;
                }
            });

            ctrl.slide(attrs.sliderValue);
            $("#ex6SliderVal").text(attrs.sliderValue);

            elm.on('slide', function(slideEvt) {
                ctrl.slide(slideEvt.value);
                $("#ex6SliderVal").text(slideEvt.value);
            });
        }
    }
});


Tuto.directive('wbSelectColor', function () {
    return {
        priority: 1000,
        restrict: 'A',
        require:'^wbColors',
        link : function (scope, elm, attrs, ctrl) {

            var index = ctrl.saveElement(elm);

            elm.on('click', function () {
                ctrl.selectColor(index);
            });

        }
    }
});


Tuto.directive('wbCanvas', function () {
	return {
		restrict: 'A',
        controller : function (WebSocketFactory, WBService) {

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
              , timer
              , params = WBService.params
              , drawingInProgress = false;

            this.init = function (elm) {

                // Init Paper.js
                paper.setup(elm);

                // Init canvas
                canvas = elm;
                offLeft = canvas.offsetLeft - 13;
                //offTop  = canvas.offsetTop;
                offTop = 70;

                // Init path
                path = new paper.Path();
                path.strokeColor = color;
            };

            this.onMouseDown = function (event) {

                var point = new paper.Point(event.clientX - offLeft, event.clientY - offTop);

                path = new paper.Path();
                path.strokeColor = params.color;
                path.strokeWidth = params.stroke;

                path.add(point);

                // Initialize the new path that will be send 
                pathToSend = {
                    color : params.color,
                    stroke : params.stroke,
                    start : point,
                    path : []
                };
            }

            this.onMouseDrag = function (event) {
    
                var point = new paper.Point(event.clientX - offLeft, event.clientY - offTop);

                path.add(point);
                path.smooth();

                pathToSend.path.push(point);

                // Send path every 100ms

                if (!drawingInProgress) {

                    timer = setInterval( function() {

                        console.log('sending');

                        WebSocketFactory.emit('drawing:progress', {path : JSON.stringify(pathToSend), id : socketId});
                        pathToSend.path = new Array();
                    }, 100);
                }

                drawingInProgress = true;

                
            };

            this.onMouseUp = function (event) {

                drawingInProgress = false;

                var point = new paper.Point(event.clientX - offLeft, event.clientY - offTop);
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
                    path.strokeWidth = data.stroke;
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