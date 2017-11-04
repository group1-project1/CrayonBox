//========================/
//     Window Reset
//========================/
$(window).ready(function(){
	// moves user to top of the window
	window.scrollTo(0,0);
});


//========================/
//         Wheel
//========================/
var degree = 1800; // default degree (360*5)
var clicks = 0;

// spins wheel on click
	var wheelSpin = function(){
		// moves user to top of the window
		window.scrollTo(0,0);
		clicks ++;
		var newDegree = degree*clicks;
		var extraDegree = Math.floor(Math.random() * (360 - 1 + 1)) + 1;
		totalDegree = newDegree+extraDegree;
		$('#wheel .sec').each(function(){
			var t = $(this);
			var noY = 0;
			var c = 0;
			var n = 700;
			var interval = setInterval(function () {
				c++;
				if (c === n) {
					clearInterval(interval);
				}
				var aoY = t.offset().top;
			}, 10);
			$('#inner-wheel').css({
				'transform' : 'rotate(' + totalDegree + 'deg)'
			});
			noY = t.offset().top;
		});
	};