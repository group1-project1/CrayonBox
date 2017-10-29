var eventMap;
var markers = [];

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
	var color = "";
	for (var i = 0; i < 6; i++) {
		color = letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function checkList() {
	$("#checkboxes").html("");
	for(var i = 0; i<cuisines.length; i++) {
		var sep = $("<div>");
		sep.addClass("checkbox-display");
		sep.addClass("col-md-12 col-sm-12 col-xs-12");
		sep.append("<input type='checkbox' name='cuisine' class='cuisine-indicator' checked='checked' id='"+cuisines[i].cuisineType+"'>" + " " + cuisines[i].cuisineType);
		var color_checker = "#" + cuisines[i].cuisineColor;
		sep.css("color", color_checker);
		$("#checkboxes").append(sep);
	}
}

//function to generate markers
function generateMarker(restaurants){
	for(i in restaurants){

		var restaurant = restaurants[i];

		var colorIndex = findCuisineIndex(restaurant.cuisineType[0]);

		var colorIcon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + cuisines[colorIndex].cuisineColor + "&chf=a,s,ee00FFFF"

		var newIcon = L.icon({
			iconUrl: colorIcon,
			iconSize: [15, 35],
			iconAnchor: [22, 25],
			popupAnchor: [-3, -76]
		});

		//creates a marker with a binded popup
		var marker = L.marker([restaurant.latitude, restaurant.longitude], {icon: newIcon})
						.bindPopup("<a href='" + restaurant.zomatoURL +
									"' target='_blank'>" +
									restaurant.name +
									"</a><hr><p>" +
									restaurant.rating +
									"/5.0  |  "+
									restaurant.dollarSigns +
									"</p>");
		var objMarker = {mark: marker, cuisine: {}};

		//addes cuisine with a status of checked
		for(i in restaurant.cuisineType){
			objMarker.cuisine[restaurant.cuisineType[i]] = "checked";
		}

		markers.push(objMarker);	
	}

	//adds the markers to the map
	for(i in markers)
		eventMap.addLayer(markers[i].mark);
}

//adds the markers to the map
function addMapMarker(event) {
	for(i in markers){
		for(key in markers[i].cuisine){
			if($(event).attr("id") === key)
				markers[i].cuisine[key] = "checked";
				
		}

		var isChecked = false;
		for(key in markers[i].cuisine){
			if(markers[i].cuisine[key] === "checked")
				isChecked = true;
		}

		if(isChecked)
			eventMap.addLayer(markers[i].mark);
	}
}

//removes the markers from the map
function removeMapMarker(event){
	for(i in markers){
		for(key in markers[i].cuisine){
			if($(event).attr("id") === key)
				markers[i].cuisine[key] = "unchecked";
				
		}

		var isChecked = false;
		for(key in markers[i].cuisine){
			if(markers[i].cuisine[key] === "checked")
				isChecked = true;
				
		}

		if(!isChecked)
			eventMap.removeLayer(markers[i].mark);
	}
}

//determines if a it was a checked or uncheck event
function checkEvent(){
	console.log(this.checked)
	if(this.checked == false)
		removeMapMarker(this);
	else
		addMapMarker(this);
}