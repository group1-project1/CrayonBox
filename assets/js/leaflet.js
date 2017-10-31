//set global map variable
var eventMap;
//initialize an array of map markers
var markers = [];

//stores the svg position of the checkmarks
var check_d = "M14.1 27.2l7.1 7.2 16.7-16.8";

//function that generates a map on the screen
function generateMap(lat, long) {
	//clears the previous markers of restaurants
	markers = [];

	//prepares the Leaflet map at the longitude and latitude
	if(eventMap != null)
		eventMap.eachLayer(function (layer){
		    eventMap.removeLayer(layer);
		});
	else
		eventMap = L.map('mapid');

	//changes the map to be at the lat and long passed in
	eventMap.setView([lat, long], 14);

	//overlays the Leaflet map with Mapbox Streetview
	var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18,
		minZoom: 10,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1Ijoia29pcG9uZHRlYXJkcm9wIiwiYSI6ImNqOTR1c2x5YzFnNjYyd3FiNmhnaXVsN3AifQ.Ja_5lBjdw-888qiaCIaUXw'
		});

	eventMap.addLayer(tileLayer);
}

//function to grab a random hex format color
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = "";
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

//function to generate a checklist of cuisine types next to or below the map
function checkList() {
	//overwrites the display to be blank
	$("#checkboxes").html("");
	//for the number of unique cuisines in the restaurant list
	for(var i = 0; i<cuisines.length; i++) {
		//create a div assigned to a variable
		var sep = $("<div>");
		//add class associated with each checkbox
		sep.addClass("checkbox-display");
		//add classes to make the checkboxes mobile responsive
		sep.addClass("row h-100");
		//append the checkbox itself and the name associated with each checkbox
		sep.append("<svg class='checkmark my-auto' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><circle class='checkmark__circle' id='"+cuisines[i].cuisineType+"' cx='26' cy='26' r='25' fill='#"
		 			+ cuisines[i].cuisineColor + "'/><path class='checkmark__check' fill='white' d='M14.1 27.2l7.1 7.2 16.7-16.8'/></svg> " 
		 			+ "<h7 class = 'cuisine_name'>" + cuisines[i].cuisineType + "</h7>");
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

//determines if it was a checked or uncheck event
function checkEvent(){
	if($(this).parent().children(".checkmark__check").attr("d") == ""){
		addMapMarker(this);
		$(this).parent().children(".checkmark__check").attr("d", check_d);
	}
	else{
		removeMapMarker(this);
		$(this).parent().children(".checkmark__check").attr("d", "");
	}
		
}