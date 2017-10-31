var apiKey = "3197191ce64f4094b7b04205172410";
var weatherUrl = 'http://api.apixu.com/v1/current.json';

function weatherCall() {
	$.ajax({
	   url: weatherUrl,
	   method: "GET",
	   data: {key: apiKey, 
	   		 // search parameter (city, zip, grid coordinates)
	   		 q: array[i]["grid"].val().trim(),
	   		 // number of days until event, limited to <=10 days in the future
	   		 days: array[i]["date"].diff(moment(), 'days') 
	   		}
	}).done(function(response) {
		console.log(this.url)
		console.log(response)
		$(".card").append('<img src="https://' + (response.current.condition.icon).substring(2) +'"/>');
	}).fail(function(response){
		console.log(this.url)
	});
};


// EX: date difference in moment.js
	// var now = moment(new Date()); //todays date
	// var end = moment("2017-11-02"); // another date
	// console.log(end.diff(now, 'days'))