Tuto.directive('tutrCanvas', function () {
	return {
		restrict: 'A',
        controller : function () {

        },
        link: function(scope, elm, attrs, ctrl) {

            paper.setup(elm[0]);

            var offLeft = elm[0].offsetLeft;
            var offTop = elm[0].offsetTop;

            var path = new paper.Path();

            path.strokeColor = 'black';

            elm.on('mousedown', function (event) {
                onMouseDown(event);

                elm.on('mousemove', function (event) {
                    onMouseDrag(event);
                });

                elm.on('mouseup', function (event) {
                    onMouseUp(event);
                    elm.unbind('mousemove');
                    elm.unbind('mouseup');
                });
            });

            function onMouseDown(event) {

                var point = event.point;

                path = new paper.Path();
                path.strokeColor = 'black';
                path.add(new paper.Point(event.x - offLeft, event.y - offTop));


            }

            function onMouseDrag(event) {
    
                path.add(new paper.Point(event.x - offLeft, event.y - offTop));
                path.smooth();


            }

            function onMouseUp(event) {
   
                // Close the users path
                path.smooth();


            }

        }
	}
});