//======================/
//     Start Button
//======================/
$('#wheel').on('click', function(){
   $(function() {
 		var colorR = Math.floor((Math.random() * 256));
      var colorG = Math.floor((Math.random() * 256));
      var colorB = Math.floor((Math.random() * 256));

		$('#search-results').append(
			 '<div class="card" style="border: 6px outset rgba(' + colorR + ',' + colorG + ',' + colorB + ',.4)">' +
		    '<img class="card-img-top mx-auto" src="assets/media/stock.png" alt="Card image cap">' +
		    '<div class="card-header">' +
		      '<h4 class="card-title">Learn Coding with Robots at RVC</h4>' +
		    '</div>' +
		    '<div class="card-body event-area">' +
		      '<p class="card-text">"Learn Coding with Robots" empowers children and adults to create adventures, play games, solve problems, and learn to code anywhere they go...</p>' +
		    '</div>' +
		    '<div class="card-footer">' +
		      '<small class="text-muted">Saturday, November 25th, 2017</small>' +
		    '</div>'
		);
	});
})

//======================/
//     Wheel Spin
//======================/
//set default degree (360*5)
var degree = 1800;
//number of clicks = 0
var clicks = 0;
$(document).ready(function(){
	$('#wheel').click(function(){
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
	});
});//DOCUMENT 


 function testAnim(x) {
    $('.animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
    });
  };

  $(document).ready(function(){
    $('.js--triggerAnimation').click(function(e){
      e.preventDefault();
      var anim = $('.js--animations').val();
      testAnim(anim);
    });

    $('.js--animations').change(function(){
      var anim = $(this).val();
      testAnim(anim);
    });
  });



$(document).ready(function(){
    $(".card").click(function(){
        $('.card').animate({height: '300px', opacity: '0.4'}, "slow");
        $('.card').animate({width: '300px', opacity: '0.8'}, "slow");

    });
});





