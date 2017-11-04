var CARDS_PER_PAGE = 12;
var page = 0;

var eventList = [];

//function to check the input of the user
function validateLocation(){
    var input = $("#search-location").val().trim();

    //checks for starting with a number
    if(input.match(/^[0-9]\d{1}/)){
        //length of 5 of only numbers, call eventSearch
        if(input.match(/^[0-9]\d{4}$/)){
            // API call to search & display events
            eventSearch(input);
        }
        //errors if starts with a number, but not length of 5
        else{
            console.log("Zip codes must be a length of 5 and only numbers");
        }
    }
    //checks for non number for a comma
    else if(input.indexOf(',') != -1){
        //errors if last character is a comma
        if(input[input.length-1] === ','){
            console.log("last spot is a comma");
        }
        else{
            //errors if a digit is found anywhere in the string
            if(input.match(/\d/))
                console.log("Found a digit");
            else
                // API call to search & display events
                eventSearch(input);
        }
    }
    //no comma found and doesnt start with a number
    else{
        //errors if a digit is found anywhere in the string
        if(input.match(/\d/))
            console.log("Found a digit");
        else
            // API call to search & display events
            eventSearch(input);
    }
}

function eventSearch(input){
    var TOKEN = "5HWZ7K734R7NM7GSELOG";
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
    var TOKEN = "5HWZ7K734R7NM7GSELOG";
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
        //call weather API
        getWeather(response.latitude, response.longitude, eventObject.date);

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
	        "logo_url": setLogoUrl(events["events"][i]["logo"]),
	        "date": events["events"][i]["start"]["utc"]
        };

        eventList.push(event);
    };
};

//set logo to stock image if event.logo is null
function setLogoUrl(logo){
    if(logo === null){
        return "assets/media/stock.png";
    } else {
        return logo["url"];
    }
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
                '<img class="card-img-top mx-auto" src="'+ array[i]["logo_url"] +'" alt="Card image cap"/>' +
            '<div class="card-body" data-spy="scroll">' +
            	 '<h5 class="card-title">' + array[i]["name"] + '</h5>' +
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

    $(".card").on("click", function(event){
    	  //console.log(event);

        var eventObject = grabEvent(event.currentTarget.id);
        locationSearch(eventObject);

        $('#event-title').html('<h4>' + eventObject["name"] + '</h4>');
        $('#event-description').html('<p>' + eventObject["desc"] + '</p>');
    });
}; 

//page through results
function turnPage(direction){
    if(direction === "forward"){
        if(page < (Math.floor((eventList.length / CARDS_PER_PAGE) - 1))){
            page++;
            dealCards(eventList);
        };
    } else if (direction === "back"){
        if(page > 0){
            page--;
            dealCards(eventList);
        };
    };
};
 

$(window).ready(function(){
    $("#wheel").on("click", function(event){
        event.preventDefault();

        //calls the validation function
        validateLocation();
			
			// animates Jumbotron on wheel click
		  $('.display-3').addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		  	$(this).removeClass('animated bounce');
		  });
    });

    $("#next-btn").on("click", function(){
        turnPage("forward");
    });

    $("#back-btn").on("click", function(){
        turnPage("back");
    });
});
