var CARDS_PER_PAGE = 12;
var page = 0;

var eventList = [];

//function to check the input of the user
function validateLocation(){
    var input = $("#search-location").val().trim();

    //removes and clears the data content of the popover
    $("#search-location").popover("dispose");
    $("#search-location").attr("data-content", "");

    function green() {
       $("#search-type").css("background", "rgba(126, 229, 131, .2)");
	   $("#search-location").css("background", "rgba(126, 229, 131, .2)");
	   $("#search-date").css("background", "rgba(126, 229, 131, .2)");
    }

    function red() {
        $("#search-type").css("background", "white");
        $("#search-location").css("background", "rgba(255, 147, 147, .5)");
        $("#search-date").css("background", "white");
    }

    //checks if the field was blank
    if(input == null || input === ""){
        red();
        $("#search-location").attr("data-content", 'Please enter a "city, state" or a zip code.');
        $("#search-location").popover("toggle");
    }
    else {
        //checks for starting with a number
        if(input.match(/^[0-9]\d{1}/)){
            //length of 5 of only numbers, call eventSearch
            if(input.match(/^[0-9]\d{4}$/)){
                // API call to search & display events
                green();
                wheelSpin();
                eventSearch(input);
            } else{
            	   //errors if starts with a number, but not length of 5
            	   red();
                   $("#search-location").attr("data-content", 'Zip codes must be a length of 5 and only numbers.');
                   $("#search-location").popover("toggle");
            }
        }
        //checks for non number for a comma
        else if(input.indexOf(',') != -1){
            //errors if last character is a comma
            if(input[input.length-1] === ','){
            	red();
                $("#search-location").attr("data-content", 'Last character is a comma.');
                $("#search-location").popover("toggle");
            } else {
                //errors if a digit is found anywhere in the string
                if(input.match(/\d/)) {
                	red();
                    $("#search-location").attr("data-content", 'Found a digit in a "city, state" input.');
                    $("#search-location").popover("toggle");
                } else {
                    // API call to search & display events
                    green();
                    wheelSpin();
    	        	eventSearch(input);
                }
            }
        }
        //no comma found and doesnt start with a number
        else{
            //errors if a digit is found anywhere in the string
            if(input.match(/\d/)) {
            	   red();
                $("#search-location").attr("data-content", 'Found a digit in a "city, state" input.');
                $("#search-location").popover("toggle");
            } else {
                // API call to search & display events
                green();
                wheelSpin();
                eventSearch(input);
            }
        }
    } //end checks for empty input
}

function eventSearch(input){
    var TOKEN = "7BOLZ5GWYR4MT73OKQPH";
    var URL = "https://www.eventbriteapi.com/v3/events/search/";

    //create parameter object
    var parameters = {
        'q': $("#search-type").val().trim(),
        'location.address': input,
        'start_date.keyword': setDate($("#search-date").val().trim())
    };

    //create query object
    var query = {
        url: URL,
        method: "GET",
        data: parameters,
        headers: {
            "Authorization": "Bearer " + TOKEN,
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };

    //empty search results div and event list
    
    eventList = [];
    page = 0;

    //make ajax api call
    $.ajax(query).done(function(response){
        parseEvents(response);
        dealCards(eventList, 10)
    });
};

//retreive long and lat of event venue
function locationSearch(eventObject){
    var TOKEN = "7BOLZ5GWYR4MT73OKQPH";
    var URL = "https://www.eventbriteapi.com/v3/venues/" + eventObject["venue_id"] + "/";

    var query = {
        url: URL,
        method: "GET",
        headers: {
            'Authorization': "Bearer " + TOKEN,
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };

    $.ajax(query).done(function(response){
        //call weather API, if event within 10 days from present	
        if (moment(eventObject.date).diff(moment(), 'days') <= 10) {
          getWeather(response.latitude, response.longitude, eventObject.date);
        } else {
        	  $('#event-weather').css("visibility", "hidden");
        }

        //call restaurant API
        getRestaurants(response.latitude, response.longitude);
    });
};

//returns the event object from eventList associated with the id parameter passed to the function
function grabEvent(id){
    for(var i in eventList){
        if(eventList[i]["id"] ===  id){
            return eventList[i];
        };
    };
};

//stores into into eventList to be used in event cards
function parseEvents(events){ 
    for(var i in events["events"]){
        var event = {
	        "id": events["events"][i]["id"],
	        "name": events["events"][i]["name"]["text"],
	        "desc": events["events"][i]["description"]["text"],
	        "venue_id": events["events"][i]["venue_id"],
	        "is_free": events["events"][i]["is_free"],
	        "logo_url": "#",
	        "date": events["events"][i]["start"]["utc"]
        };
        setLogoUrl(event, events["events"][i]);

        eventList.push(event);
    };
};


//set logo to stock image if event.logo is null or is an invalid link
function setLogoUrl(event, obj){
    if(obj["logo"] === null){
        event["logo_url"] = "assets/media/stock.png";
    } else {
        $.get(obj["logo"]["url"])
        .done(function(){
            $("#" + obj["id"] + "_img").attr("src", obj["logo"]["url"])
            event["logo_url"] = obj["logo"]["url"]

        })
        .fail(function(){
            $("#" + obj["id"] + "_img").attr("src", "assets/media/stock.png")
            event["logo_url"] = "assets/media/stock.png"
        });

    };
};

//set date to blank string if date = "All Dates"
function setDate(date){
    if(date === "All Dates"){
        return "";
    } else {
        return date.toLowerCase().split(" ").join("_");
    }
};

//generate event cards and append them to the page
function dealCards(array) {
    //empty search results div
    $("#search-results").empty();

    if(array.length === 0){
        //sorry, no events match your current search parameters
    };
    
    for(var i = (page * CARDS_PER_PAGE); (i < (CARDS_PER_PAGE * (page + 1)) && i < array.length); i++){
        //create randomized RGB values for each card border
        var colorR = Math.floor((Math.random() * 256));
        var colorG = Math.floor((Math.random() * 256));
        var colorB = Math.floor((Math.random() * 256));

        //set default values for price image url and alt text
        var dollarSign = "#";
        var alt = "";

        //overwrite default values if event is not free
        if(!array[i]["is_free"]){
            dollarSign = "assets/media/dollar.png";
            alt = "Paid event";
        };

        //create event card
        $('#search-results').append(
            '<div id="' + array[i]["id"] + '" class="card animated fadeIn" data-toggle="modal" data-target="#event-info" style="border: 5px outset rgba(' + colorR + ',' + colorG + ',' + colorB + ',.4); background: rgba(' + colorR + ',' + colorG + ',' + colorB + ',.17)">' +
                '<img class="dollar" src="' + dollarSign + '" alt="' + alt + '"/>' + 
                '<img id="' + array[i]["id"] + '_img' + '" class="card-img-top mx-auto" src="' + array[i]["logo_url"] + '" alt="Card image cap"/>' +
            '<div class="card-header">' +
            	 '<h5 class="card-title">' + array[i]["name"] + '</h5>' +
            '</div>' +
            '<div class="card-body" data-spy="scroll">' +
                '<p class="card-text">' + array[i]["desc"] + '</p>' +
            '</div>' +
            '<div class="card-footer">' +
                '<small class="text">' + moment(array[i]["date"]).local().format("dddd LT") + '</small> <br>' +
                '<small class="text">' + moment(array[i]["date"]).local().format("LL") + '</small>' +
            '</div>'
        );
    }; 

    //display back-next buttons
    $('.btn-group').css('visibility','visible');
}; 

// listen for event-click and initiate location
$(document.body).on("click", ".card", function(event){
  
    var eventObject = grabEvent(event.currentTarget.id);
    locationSearch(eventObject);

	  // resets modal to have event info default
	  $('#pills-map-tab').removeClass('active');
	  $('#pills-map').removeClass('fade show active');
	  $('#pills-restaurant-tab').removeClass('active');
	  $('#pills-restaurant').removeClass('fade show active');
	  $('#pills-event-tab').addClass('active');
	  $('#pills-event').addClass('fade show active');

    // print info on Event Info tab in modal
    $('#event-title').html('<h4>' + eventObject["name"] + '</h4>');
    $('#event-date').html('<p class="card-text">' + moment(eventObject["date"]).local().format("LLLL") + '</p>')
    $('#event-description').html('<p>' + eventObject["desc"] + '</p>');
});

//page through results
function turnPage(direction){
    if(direction === "forward"){
        if(page < (Math.floor(eventList.length / CARDS_PER_PAGE))){
            page++;
            dealCards(eventList);
        };
    } else if (direction === "back"){
        if(page > 0){
            page--;
            dealCards(eventList);
        }
    }
};
 

$(window).ready(function(){
    $("#wheel").on("click", function(event){
        //event.preventDefault();

        //calls the validation function
        validateLocation();
			
			// animates Jumbotron on wheel click
		  $('.display-3').addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		  	$(this).removeClass('animated bounce');
		  });
    });

    // next button to iterate search results
    $("#next-btn").on("click", function(){
        turnPage("forward");
    });

    // back button to iterate search results
    $("#back-btn").on("click", function(){
        turnPage("back");
    });
});
