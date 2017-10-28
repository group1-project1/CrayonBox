var restaurants = [];

function getRestaurants(lat, lon){
	//zomato parameters
	var apiKey = "c188051510e27b0340260960580b380e";
	var queryURL = "https://developers.zomato.com/api/v2.1/search";

	var parameters = {};

	//42.054079, -87.681641 Evanston, IL

	//populates the parameters
	parameters.lat = lat;
	parameters.lon = lon;
	parameters.radius = 8000; //5 miles in meters
	parameters.sort = "real_distance";
	parameters.order = "asc";
	
	parameters.key = apiKey;
	

	$.ajax({
		url: queryURL,
		method: "GET",
		data: parameters,
		headers: {"user-key": apiKey}
	}).done(function(response){
		console.log(this.url)
		populateRestaurants(response);
		generateMap(lat, lon);
		markerMaker(restaurants);
	})
}

function populateRestaurants(restaurant){
	//generates an object of the restaurants info
	for(i in restaurant.restaurants){
		var r = {};
		r.latitude = restaurant.restaurants[i].restaurant.location.latitude;
		r.longitude = restaurant.restaurants[i].restaurant.location.longitude;
		r.name = restaurant.restaurants[i].restaurant.name;
		r.zomatoURL = restaurant.restaurants[i].restaurant.url;
		r.dollarSigns = "";
		r.rating = restaurant.restaurants[i].restaurant.user_rating.aggregate_rating;
		r.cuisineType = restaurant.restaurants[i].restaurant.cuisines.split(", ");

		//turns the integer rating to $
		for(var i = 0; i < restaurant.restaurants[i].restaurant.price_range; i++)
			r.dollarSigns += "$";

		//adds to the array of restaurants
		restaurants.push(r);
	}
}
