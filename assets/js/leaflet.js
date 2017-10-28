
	var cuisines = [];
	var cuisine_color = [];
	var eventMap;

	function generateMap(lat, long) {

	eventMap = L.map('mapid').setView([lat, long], 14);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		minZoom: 10,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1Ijoia29pcG9uZHRlYXJkcm9wIiwiYSI6ImNqOTR1c2x5YzFnNjYyd3FiNmhnaXVsN3AifQ.Ja_5lBjdw-888qiaCIaUXw'
		}).addTo(eventMap);

	var circle = L.circle([lat, long], {
		color: 'green',
		fillColor: '#f03',
		fillOpacity: 0.2,
		radius: 3200
	}).addTo(eventMap);

}

	function getRandomColor() {
  		var letters = '0123456789ABCDEF';
  		var color;
  		for (var i = 0; i < 6; i++) {
    		color = letters[Math.floor(Math.random() * 16)];
  		}
  		return color;
	}

	function cuisineList(restaurant) {
		var cuisine = restaurant.cuisineType;
		var a = cuisines.indexOf(cuisine);
		var b = getRandomColor();
		if (a === -1) {
			cuisines.push(cuisine);
			cuisine_color.push(b);
		}
		console.log(cuisines);
	}

	function checkList() {
		$("#checkboxes").html("");
		for(var i = 0; i<cuisines.length; i++) {
			var sep = $("<div>");
			sep.attr("class", "checkbox-display");
			sep.attr("class", "col-md-12 col-sm-12 col-xs-12")
			sep.append("<input type='checkbox' name='cuisine' class='cuisine-indicator' checked='checked'>" + " " + cuisines[i]);
			var color_checker = "#" + cuisine_color[i];
			console.log(color_checker);
			sep.css("color", color_checker);
			$("#checkboxes").append(sep);
		}
	}

	function markerMaker(restaurants) {
		for(i in restaurants){

			var restaurant = restaurants[i];

			cuisineList(restaurant);

			var colorIndex = cuisines.indexOf(restaurant.cuisineType);

			var colorize = cuisine_color[colorIndex];

			var colorIcon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colorize + "&chf=a,s,ee00FFFF"

			var newIcon = L.icon({
				iconUrl: colorIcon,
				iconSize: [15, 35],
				iconAnchor: [22, 25],
				popupAnchor: [-3, -76]
			})

			L.marker([restaurant.latitude, restaurant.longitude], {icon: newIcon}).addTo(eventMap).bindPopup("<a href='" + restaurant.zomatoURL + "' target='_blank'>" + restaurant.name + "</a><hr><p>" + restaurant.rating + "/5.0  |  " + restaurant.dollarSigns + "</p>");
		}
	}

	checkList();

	/*

	$(document).on("click", ".checkbox-display", function() {
		var check_status = $(this).attr("checked");
		console.log(check_status);
		if (check_status=== "checked") {
			$(this).attr("checked", "unchecked");
		}
		else {
			$(this).attr("checked", "checked");
		}
	})

	*/