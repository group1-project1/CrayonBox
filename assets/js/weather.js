var apiKey = "3197191ce64f4094b7b04205172410";
var weatherUrl = 'http://api.apixu.com/v1/current.json';

var getWeather = function(lat, lon, date) {

	// if ( (moment(date).diff(moment()) <= 10) && (moment(date).diff(moment())<0) ) {
		//console.log(lat, lon, date)

		$.ajax({
		  url: weatherUrl,
		  method: "GET",
		  data: {
		    key: apiKey, 
	  		 // search parameter (city, zip, grid coordinates)
	  		 q: lat + "," + lon,
	  		 // number of days until event, limited to <=10 days in the future
	  		 days: moment(date).diff(moment(), 'days') 
		  	}
		}).done(function(response) {
				$('#event-weather').html('<img src="https:' + response.current.condition.icon + '"/>');
				$('#event-weather').css("visibility", "visible")
		}).fail(function(response){
			console.log(this.url);
		});
	// }
};