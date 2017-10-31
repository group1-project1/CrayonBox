var eventList = [];


function eventSearch(){
    var TOKEN = "5HWZ7K734R7NM7GSELOG";
    var URL = "https://www.eventbriteapi.com/v3/events/search/";

    //create parameter object
    var parameters = {
        'q': $("#search-type").val().trim(),
        'location.address': $("#search-location").val().trim(),
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

    //empty search results div
    $("#search-results").empty();
    eventList = [];

    //make ajax api call
    $.ajax(query).done(function(response){
        console.log(response);
        parseEvents(response);
        dealCards(eventList, 10)
    });
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
    } else{
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

//trim event Title for display on event cards
function trimTitle(text){
	// if (text.length < 40) {
	// 	return text;
	// } else { 
	// 	return text.slice(0, 100) + "...";
 //   }
 	return text;

};

//trim event Description text for display on event cards
function trimDescription(text){
    //return text.split(" ").splice(0, 40).join(" ") + "...";
    return text;
};

//generate event cards and append them to the page
function dealCards(array, stop) {
    for(var i = 0; i < stop; i++){
        var colorR = Math.floor((Math.random() * 256));
        var colorG = Math.floor((Math.random() * 256));
        var colorB = Math.floor((Math.random() * 256));

        var dollarSign = "#";
        var alt = "";

        if(!array[i]["is_free"]){
            dollarSign = "assets/media/dollar.png";
            alt = "paid event";
        };

        //create event card
        $('#search-results').append(
            '<div id="' + array[i]["id"] + '" class="card animated fadeIn" style="border: 5px outset rgba(' + colorR + ',' + colorG + ',' + colorB + ',.4); background: rgba(' + colorR + ',' + colorG + ',' + colorB + ',.17)">' +
                '<img class="dollar" src="' + dollarSign + '" alt="' + alt + '"/>' + 
                '<img class="card-img-top mx-auto" src="'+ array[i]["logo_url"] +'" alt="Card image cap"/>' +
            '<div class="card-body" data-spy="scroll">' +
            	 '<h5 class="card-title">' + trimTitle(array[i]["name"]) + '</h5>' +
                '<p class="card-text">' + trimDescription(array[i]["desc"]) + '</p>' +
            '</div>' +
            '<div class="card-footer">' +
                '<small class="text">' + moment(array[i]["date"]).local().format("dddd LT") + '</small> <br>' +
                '<small class="text">' + moment(array[i]["date"]).local().format("LL") + '</small>' +
            '</div>'
        );
    };  
}; 
 

$(window).ready(function(){
    $("#wheel").on("click", function(event){
        event.preventDefault();

        // API call
        eventSearch(); 
			
			// animates Jumbotron on wheel click
		  $('.display-3').addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		  	$(this).removeClass('animated bounce');
		  });
    });
});
