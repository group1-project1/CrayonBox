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

    //empty search results div and event list
    $("#search-results").empty();
    eventList = [];

    //make ajax api call
    $.ajax(query).done(function(response){
        console.log(response);
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
        console.log(response["latitude"]);
    })
}



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
    }
    else{
        return logo["url"];
    }
};

//set date to blank string if date = "All Dates"
function setDate(date){
    if(date === "All Dates"){
        return "";
    }
    else{
        return date.toLowerCase().split(" ").join("_");
    }
};

//trim event name for display on event cards
function trimTitle(text){
    if(text.length > 18){
        return text.slice(0, 18) + "...";
    }
    else{
        return text;
    };
};

//trim description text for display on event cards
function trimDescription(text){
    return text.split(" ").splice(0, 25).join(" ") + "...";
};



//generate event cards and append them to the page
function dealCards(array, stop) {
    for(var i = 0; i < stop; i++){
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
            '<div id="' + array[i]["id"] + '" class="card" style="border: 5px outset rgba(' + colorR + ',' + colorG + ',' + colorB + ',.4)">' +
                '<img class="card-img-top mx-auto" id="' +array[i]["id"] + '-img'  + '" src="'+ array[i]["logo_url"] +'" alt="Card image cap"/>' +
                '<div class="card-header" id="' + array[i]["id"] + '-title'  + '">'+ 
                    '<h4 class="card-title">' + trimTitle(array[i]["name"]) + '</h4>' +
                '</div>' +
                '<div class="card-body event-area" id="' + array[i]["id"] + '-desc'  + '">' +
                    '<p class="card-text">' + trimDescription(array[i]["desc"]) + '</p>' +
                '</div>' +
                '<div class="card-footer">' +
                    '<small class="text-muted">' + moment(array[i]["date"]).local().format("LLLL") + '</small>' +
                    '<img class="dollar" src="' + dollarSign + '" alt="' + alt + '"/>' + 
                '</div>' +
            '</div>'
        );
    }; 

    //bind newly generated cards to their respective click handler functions
    $(".card-header").on("click", function(event){
        titleClick(event);
    });

    $(".card-body").on("click", function(event){
        descriptionClick(event);

    });

    $(".card-img-top").on("click", function(event){
        var eventObject = grabEvent(event.currentTarget.id.split("-")[0]);
        locationSearch(eventObject);
    })


};

//returns the event object from eventList associated with the id parameter passed to the function
function grabEvent(id){
    for(var i in eventList){
        if(eventList[i]["id"] ===  id){
            return eventList[i];
        };
    };
};


function titleClick(ev){
    var classes = ev.currentTarget.className.split(" ");
    var eventObject = grabEvent(ev.currentTarget.id.split("-")[0]);
    var target = $("#" + ev.currentTarget.id);


    if(eventObject["name"].length > 18){
        if(target.attr("class").split(" ").includes("expanded")){
            target.children().first().html(trimTitle(eventObject["name"]));
            target.removeClass("expanded");
        }
        else{
            target.children().first().html(eventObject["name"]);
            target.addClass("expanded");
        };
    };

}

function descriptionClick(ev){
    var classes = ev.currentTarget.className.split(" ");
    var eventObject = grabEvent(ev.currentTarget.id.split("-")[0]);
    var target = $("#" + ev.currentTarget.id);

    if(target.attr("class").split(" ").includes("expanded")){
        target.children().first().html(trimDescription(eventObject["desc"]));
        target.removeClass("expanded");
    }
    else{
        target.children().first().html(eventObject["desc"]);
        target.addClass("expanded");
    };
};

function imageClick(ev){
    var eventObject = grabEvent(ev.currentTarget.id.split("-")[0]);

    
}

$(window).ready(function(){
    $("#wheel").on("click", function(event){
        event.preventDefault();

        eventSearch();  
    });


});
