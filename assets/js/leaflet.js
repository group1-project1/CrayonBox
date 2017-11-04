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

	//changes the map to be at the latitude and longitude passed through with initial Leaflet zoom set to 14.5
	eventMap.setView([lat, long], 14.5);
	//generate an event marker at the latitude and longitude
	generateEventMarker(lat, long);

	//overlays the Leaflet map with Mapbox Streetview
	var tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		//max user zoom in
		maxZoom: 16,
		//max user zoom out
		minZoom: 12,
		//Streetview overlay
		id: 'mapbox.streets',
		//access token for mapbox
		accessToken: 'pk.eyJ1Ijoia29pcG9uZHRlYXJkcm9wIiwiYSI6ImNqOTR1c2x5YzFnNjYyd3FiNmhnaXVsN3AifQ.Ja_5lBjdw-888qiaCIaUXw'
		});
	//add the streetview overlay to the Leaflet map
	eventMap.addLayer(tileLayer);
}

//function to grab a random hex format color
function getRandomColor() {
	//possible hex code characters
	var letters = '0123456789ABCDEF';
	//initial string
	var color = "";
	//add six characters to the hex code
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	//return hexcode WITHOUT #
	return color;
}

//function to generate a checklist of cuisine types next to or below the map
function checkList() {
	//overwrites the display to be blank
	$("#checkboxes").html("");
	//for the number of unique cuisines in the restaurant list
	for(var i = 0; i<cuisines.length; i++) {
		var mainDiv = $("<div>");
		mainDiv.addClass("col-auto float-left checkbox");
		//create a div assigned to a variable
		var sep = $("<div>");
		//add class associated with each checkbox
		sep.addClass("checkbox-display");
		//add border color to each checkbox
		sep.css("border-color", "#"+cuisines[i].cuisineColor);
		//add classes to make the checkboxes mobile responsive
		sep.addClass("row h-100");
		//append the checkbox itself and the name associated with each checkbox
		//checkbox is an svg shape with color coded circle, checkmark and subtle animation
		sep.append("<div class='my-auto'><svg class='checkmark float-left' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'><circle class='checkmark__circle' id='"+cuisines[i].cuisineType+"' cx='26' cy='26' r='25' fill='#"
		 			+ cuisines[i].cuisineColor + "'/><path class='checkmark__check' fill='white' d='M14.1 27.2l7.1 7.2 16.7-16.8'/></svg> " 
		 			+ "<h7 class='cuisine-name float-left'>" + cuisines[i].cuisineType + "</h7></div>");
		//append the checkmark to the mainDiv
		mainDiv.append(sep);
		//display the checkmark and cuisine in the checkboxes div
		$("#checkboxes").append(mainDiv);
	}
}
//generate an eventMarker on the Leaflet map
function generateEventMarker(lat, long){

	//set the icon
	var redIcon = new L.Icon({
	  //grab the red leaflet icon URL
	  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	  //add a shadow for aesthetic
	  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	  //size of the icon
	  iconSize: [25, 41],
	  //point of the icon relative to the longitude and latitude
	  iconAnchor: [12, 41],
	  //point of the popup window relative to the icon
	  popupAnchor: [1, -34],
	  //size of the shadow
	  shadowSize: [41, 41]
	});

	//display the redIcon with an on-click popup that says EVENT
	L.marker([lat, long], {icon: redIcon}).addTo(eventMap).bindPopup("<p> EVENT </p>");
}

//function to generate markers
function generateMarker(restaurants){

	//for each restaurant in the restaurant array
	for(i in restaurants){

		//set a variable associated with restaurant
		var restaurant = restaurants[i];

		//set a colorIndex variable correlative with the position of the first cuisine type associated with that restaurant
		var colorIndex = findCuisineIndex(restaurant.cuisineType[0]);

		//establish a colorIcon from google's map pin icons that allows for changeable colors/hex code in URL
		var colorIcon = "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + cuisines[colorIndex].cuisineColor + "&chf=a,s,ee00FFFF"

		//set the colored icon
		var newIcon = L.icon({
			//google icon URL with cuisine color
			iconUrl: colorIcon,
			//icon size
			iconSize: [15, 35],
			//icon point relative to the longitude and latitude
			iconAnchor: [22, 25],
			//point of the popup window relative to the icon
			popupAnchor: [-15, -18]
		});

		//creates a marker with a binded popup
		var marker = L.marker([restaurant.latitude, restaurant.longitude], {icon: newIcon})
						//popup window on click for each marker with name linked to Zomato URL, rating indicator and price level
						.bindPopup("<a class ='text-center' href='" + restaurant.zomatoURL +
									"' target='_blank'>" +
									restaurant.name +
									"</a><hr><p>" +
									restaurant.rating +
									"/5.0  |  "+
									restaurant.dollarSigns +
									"</p>");
		//create an object with the marker and its cuisine type
		var objMarker = {mark: marker, cuisine: {}};

		//addes cuisine with a status of checked
		for(i in restaurant.cuisineType){
			objMarker.cuisine[restaurant.cuisineType[i]] = "checked";
		}

		//push the object to an array of markers
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
  //.checkbox -> div -> svg is the current structure this code follows

	//if the click was on an unchecked cuisine
	if($(this).children().children().children(".checkmark__check").attr("d") == ""){
		//add the markers associated with that cuisine type
		addMapMarker($(this).children().children().children(".checkmark__circle"));
		//reset the "d" attribute to the checkmark icon
		$(this).children().children().children(".checkmark__check").attr("d", check_d);
	}
	//if the click was on a checked cuisine
	else{
		//remove the markers associated with that cuisine type
		removeMapMarker($(this).children().children().children(".checkmark__circle"));
		//reset the "d" attribute to the empty string
		$(this).children().children().children(".checkmark__check").attr("d", "");
	}	
}
