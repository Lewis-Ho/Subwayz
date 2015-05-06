src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"

var directionsDisplay;                  // Google Direction route display 
var directionsService;                  // Google Direction route service
var geocoder;                           // Reverse geocoding for current location
var currentAddress = 'placeholder';     // Placeholder for current location
var tabCount = 0;                       // Tabs count
var altRouteCount = 0;                  // Alt route count
var savedRoutes;                        // Returned direction result included all routes information
var map;                                // Map object
var pos;                                // Current user position

var votingStation = [];     // Store transit information where matched user's current location 
var transitObj = [];        // Store all transit involved route


$(document).ready(function(){

  // Keeps form pointAB from refreshing the page.
  $('#pointAB').on('submit', function (e) { 
  	e.preventDefault(); 
  });

  $('#feedback').on('submit', function (e) {
    e.preventDefault();
    if ($('#feedback-content').val() != '') {
      $('#user-email').attr('disabled', 'true');
      $('#feedback-content').attr('disabled', 'true');
      $('#navCarousel').carousel(0);
    }
  });

  $('#tabs').tab();

  $('#tab0 > a').on('click', function (e) { 
  	e.preventDefault();
    //$(this).tab('show');
    console.log ("A");
    //$('a [href="' + $(this).attr('href') + '"]').tab('show');
  });

  $('#sidebar').click(toggleSidebar);
  $('#deletes').click(deleteTabs);
  $('#routeChange').click(function () {
		var index = $('#routeChange').data('route');
		index = (index+1)%altRouteCount;
		deleteTabs();
		printRoute (savedRoutes, index);
		$('#routeChange').data('route', index);
	});

  // Call Google Direction 
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  // Google Autocomplete
  var start_input = document.getElementById('start');
  var end_input = document.getElementById('end');
  var bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.532980, -74.118551),
    new google.maps.LatLng(40.895218, -73.735403)
  );
  
  // Bounds right now only restrict country
  var start_autocomplete = new google.maps.places.Autocomplete((start_input),{
      // bounds: {sw:new google.maps.LatLng(40.895218, -73.735403), ne:new google.maps.LatLng(40.532980, -74.118551)},
      componentRestrictions: {country: 'us'}
    }
  );
  var end_autocomplete = new google.maps.places.Autocomplete((end_input),{
      // bounds: {sw:new google.maps.LatLng(40.895218, -73.735403), ne:new google.maps.LatLng(40.532980, -74.118551)},
      componentRestrictions: {country: 'us'}
    }
  );
  start_autocomplete.setBounds(bounds);
  end_autocomplete.setBounds(bounds);
  
  // Initial map 
  function initialize() {
    // Default pos for map will be center of Manhattan
    if(!pos){
      pos = new google.maps.LatLng(40.784148400000000000, -73.966140699999980000);
    }
    // Set map option, detail see google map doc
    var mapOptions = {
      center: pos,
      zoom: 13
    };
  
    // Get geolocation, output error if geolcation API not support
    getAddress();

    // Draw Map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    
    // Google Direction text route
    directionsDisplay.setMap(map);
  }

  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);

  $('#navCarousel').on('slid', function() {
    // Get/Set map-canvas class using off-left technique
    if(this.id == 'marker2'){
      // Center map to prevent 
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    }
  }); 
  
  // Constantly check user location with station location in every
  window.setInterval(function(){checkLocation(transitObj)},10000);
});

// Redirect to voting page if user is in one of the station they search
function checkLocation(transitObj) {
  // If geolocation available, get position
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {timeout:60000,maximumAge:60000});
  }
  // Geolocation val
  console.log(pos.j + " " + pos.C);
  console.log(transitObj);
  for (var j = 0; j < transitObj.length; j++) {
    //console.log(transitObj[j].transit.departure_stop.location.A + " " + transitObj[j].transit.departure_stop.location.F);
    console.log(transitObj[j].transit.departure_stop.location.j + " " + transitObj[j].transit.departure_stop.location.C);
    
    // // Check user location with each transit steps station location
    // if (userLocation.A == transitObj[j].transit.departure_stop.location.A & userLocation.F == transitObj[j].transit.departure_stop.location.F) {
    //   // Found match station
    //   votingStation = transitObj[0];
    //   document.getElementById('cur-train').innerHTML = votingStation.transit.line.short_name;
    //   document.getElementById('cur-station').innerHTML = votingStation.transit.departure_stop.name;
    //   // Redirect page to vote
    //   document.getElementById('map-canvas').className = "canvas-hide";
    //   $('#navCarousel').carousel(2);
    // }
    
    // TESTING DATASET
    if (true) {
      // Found match station
      votingStation = transitObj[0];
      document.getElementById('cur-train').innerHTML = votingStation.transit.line.short_name;
      document.getElementById('cur-station').innerHTML = votingStation.transit.departure_stop.name;
      // Redirect page to vote
      $('#navCarousel').carousel(2);
    }
  }
};

/************************************************
	Site Navigational Elements
************************************************/

function toggleSidebar() {
	var state = $('#sidebar').data('toggle');

	if (state == 'hidden') {
  	document.getElementById('sidebar').className = "sidebar-appear";
    $('#sidebar').data('toggle', 'shown');
	}
  else if (state == 'shown') {
    document.getElementById('sidebar').className = "sidebar-hidden";
    $('#sidebar').data('toggle', 'hidden');
  }
};

function nextSlide() {
  $('#navCarousel').carousel('next');
};

function prevSlide(){
  $('#navCarousel').carousel('prev');
};

/************************************************
	UI Messages
************************************************/

function hideMessage(){
  $('#init-message').hide(1000);
};

function pushMessage (messageType, message) {
  $('#message-container').hide (0);

  if (messageType == 'error') {
    document.getElementById('message-container').className = "alert alert-danger";
    document.getElementById('icon').className = "glyphicon glyphicon-remove-sign";
  }
  else if (messageType == 'success') {
     document.getElementById('message-container').className = "alert alert-success";
     document.getElementById('icon').className = "glyphicon glyphicon-ok-sign";
  }
  else if (messageType == 'warn') {
      document.getElementById('message-container').className = "alert alert-warning";
      document.getElementById('icon').className = "glyphicon glyphicon-exclaimation-sign";
  }
  else {
    //Congrats. Senpai has noticed your ability to break shit. Rejoice.
    console.error ("Please check your messageType.")
  }

  $('#message').text(message);
  $('#message-container').show (1000);
};

/************************************************
	Information Retrieval
************************************************/

// Get current location button function
function getAddress(callback){
  geocoder = new google.maps.Geocoder();

  // If geolocation available, get position
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {timeout:60000,maximumAge:60000});
  }
  //Else, browser doesn't support geolocaiton
  else {
    pushMessage ('error', 'Your browser doesn\'t support geolocation.');
    console.log("Browser doesn't support geolocaiton");
  }
  // Optional callback
  if (callback){
    callback();
  }
};

// Browser Supported Geolocation API, Get Current Location
function successCallback(position){
  pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  console.log(pos);
  //Reverse geocoding for current location
  geocoder.geocode({'latLng': pos}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results.length != 0) {
        currentAddress = results[0].formatted_address;
        // Write into start textbox
        var start = document.getElementById('start');
        start.value = currentAddress;
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
};

// Error Message for Geolocation API
function errorCallback(){
  console.log('Geocoder failed');
};

// Callback Function Used From the Front
fillAddress = function() {
  if (currentAddress != 'placeholder') {
    $('#start').val (currentAddress);  
    pushMessage ('success', "Got your current location!");
  }
  else {
    pushMessage ('warn', 'Please share your location to use this feature, or try again.');
  }
};

// Take inputs from user and set route. Function get request direction result 
function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;

  if (start == '' && end == '') {
    pushMessage ('error', "Please fill in your current location and destination.");
    start='';
    end='';
    return;
  }
  else if (start == '') {
    pushMessage ('error', "Please fill in your current location.");
    start='';
    end='';
    return;
  }
  else if (end == '') {
    pushMessage ('error', "Please fill in your destination.");
    start='';
    end='';
    return;
  }
  else {
    start += ' new york city';
    end += ' new york city';
  }

  //Add "Directions" button to #sidebar #menu after initial search.
  if ($('#goBtn').data('initial') == true) {
    $('#goBtn').data('initial', false);
    $('#menu button[data-slide-to="0"]').after('<button class="btn btn-default" data-target="#navCarousel" data-slide-to="1">Directions</button>');
  }

  var request = {
    origin: start,
    destination: end,
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.TRANSIT
  };

  deleteTabs();

  // Getting result from Google Direction
  directionsService.route(request, function(response, status) {
    console.log(response);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
			altRouteCount = response.routes.length;
			savedRoutes = response;

      // Differentiate transit type
      //diffRoute (savedRoutes);
			printRoute (savedRoutes, 0);
      
      // Write to cookies
      writeCookies(savedRoutes);
      
      //Move to next slide when directions have been retrieved.
      if(savedRoutes.routes[0].legs[0].steps[0].distance.value < 60){
        // First station as voting station
        votingStation = getFirstStep(transitObj);
        // Redirect to vote page
        $('#navCarousel').carousel(2);
      } else {
        // Redirect to map info page, make sure the map is centered
        $('#navCarousel').carousel(1);
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      }
      //Disable loading icon pseudocode.
      //$('#loadingIcon').hide(300);
    }
    else {
      //If DirectionsStatus.NOT_FOUND 
      //or DirectionsStatus.ZERO_RESULTS
      pushMessage ('error', 'No directions found.');
    }
  });
};

// Write info to cookies
function writeCookies (routeObj){
  getAlltransit(routeObj);
  getFirstStep(transitObj);
}

// Get all transit(Subway) consist transit info
function getAlltransit (routeObj){
  for (i = 0; i < routeObj.routes.length; i++){
    var thisRoute = routeObj.routes[i].legs[0];
    for (var j = 0; j < thisRoute.steps.length; j++) {
      // Only check obj which is related to transit
      if (thisRoute.steps[j].hasOwnProperty('transit') && thisRoute.steps[j].transit.line.vehicle.type == "SUBWAY") {
        transitObj.push(thisRoute.steps[j]);
      }
    }
  }
}

// Get first step which consist transit info
function getFirstStep (transitObj){
  // transitObj node name steps 
  if (transitObj.length > 0) {
    return transitObj[0];
  }
}

// Differentiate Transit Type for SavedRoute Object
function diffRoute (routeObj){
  console.log(routeObj);
  
  for (i = 0; i < routeObj.routes.length; i++){
  	// Get route object
    var thisRoute = routeObj.routes[i].legs[0];
    for (var j = 0; j < thisRoute.steps.length; j++) {
      // Only check obj which is related to transit
      if (thisRoute.steps[j].hasOwnProperty('transit') ) {
        console.log(thisRoute.steps[j].transit.arrival_stop.location.D + " " + thisRoute.steps[j].transit.arrival_stop.location.k)
        
        // Switch case for vehicle type
        switch(thisRoute.steps[j].transit.line.vehicle.type) {
            case "RAIL":
                console.log(thisRoute.steps[j].instructions + ' ' + "RAIL");
                break;
            case "SUBWAY":
                console.log(thisRoute.steps[j].instructions + ' ' + "SUBWAY");
                break;
            case "BUS":
                console.log(thisRoute.steps[j].instructions + ' ' + "BUS");
                break;
            case "FERRY":
                console.log(thisRoute.steps[j].instructions + ' ' + "FERRY");
                break;
            default:
                console.log(thisRoute.steps[j].instructions + ' ' + "OTHER");
        }
      }
    } // End Steps Loop
  } // End Routes Loop
}
    

function printRoute (routeObj, routeNo) {
	// Get route object
  var thisRoute = routeObj.routes[routeNo].legs[0];
  
  renderDir (routeObj, routeNo);

  for (var i = 0; i < thisRoute.steps.length; i++) {
  	// Find all possible transit
    if (typeof thisRoute.steps[i].transit != 'undefined' 
     	&& thisRoute.steps[i].transit.line.vehicle.type == "SUBWAY") {
      	trainTab (thisRoute.steps[i]);
    }
  }
};

//Get details from Maps API json object
function getTransitDetail(obj, tabNo){
	var parent='';
	if (tabNo) {
		parent='div#tab'+tabNo+' ';
	}

  $(parent+'#train').text(obj.transit.line.short_name + " Train");
  $(parent+'#train-stop-depart').text(obj.transit.departure_stop.name);
  $(parent+'#train-stop-end').text(obj.transit.arrival_stop.name);
  $(parent+'#num-stop').text(obj.transit.num_stops + " Stops");
  $(parent+'#arrival_time').text(obj.transit.arrival_time.text);
  $(parent+'#departure_time').text(obj.transit.departure_time.text);
  $(parent+'#distance').text(obj.distance.text);
  $(parent+'#duration').text(obj.duration.text);
  
  // Get weekday
  var weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  var routeDay = weekday[obj.transit.departure_time.value.getDay()];
  
  // Get route time
  var theTime = obj.transit.departure_time.value.toJSON().substr(11, 8);
  // Get prediction info
  $.ajax({
      type:'GET',
      url:'/welcome/prediction_alg',
      data: { station_name : obj.transit.departure_stop.name, train : obj.transit.line.short_name , headsign : obj.transit.headsign, day: routeDay, time: theTime},
      success:function(data){
        //I assume you want to do something on controller action execution success?
        //$(this).addClass('done');
        //console.log(data);
        $(parent+'#predict-info').text(data);
      }
    });
};

// Get current time from device
function getTime(){
  var currentdate = new Date(); 
  var datetime = currentdate.getDate() + "/"
              + (currentdate.getMonth()+1)  + "/" 
              + currentdate.getFullYear() + " @ "  
              + currentdate.getHours() + ":"  
              + currentdate.getMinutes() + ":" 
              + currentdate.getSeconds();
  return datetime;
};

function makeNewTab() {
	var prevTab = 'tab' + tabCount;
	tabCount++;
	var newTab = 'tab' + tabCount;

	//Adds tab to nav bar
	$('#routeChange').before('<li><a href="#'+newTab+'" data-toggle="tab">TAG LABEL</a></li>');
	//Adds contents of tab
	$('div.tab-content #'+prevTab).after('<div id="'+newTab+'"></div>');
	$('#'+newTab).addClass("tab-pane");
};

function deleteTabs() {
	var thisTab;

	while (tabCount >= 1) {
		thisTab = 'tab' + tabCount;
		//Remove tab from nav bar
		$('ul#tabs li:not(#directionsTab, #routeChange)').remove();
		//Remove contents of tab
		$('#'+thisTab).remove();
		tabCount--;
	}

	tabCount = 0;

	$('#tabs a:first').tab('show');
};

function trainTab (obj) {
	makeNewTab();
	$('ul#tabs li a[href="#tab'+tabCount+'"]').text(obj.transit.line.short_name);
	$('#tab'+tabCount).append (
			'<div id="station-info" class="col-xs-11 col-xs-height col-sm-12 col-sm-height">\
			  <p>Station Info:</p>\
			  <p id="train"></p>\
		    <p id="train-stop-depart"></p>\
		    <p id="train-stop-end"></p>\
		    <p id="num-stop"></p>\
		    <p id="arrival_time"></p>\
		    <p id="departure_time"></p>\
		    <p id="distance"></p>\
		    <p id="duration"></p>\
        <p id="predict-info"></p>\
		    <!-- <%= link_to "an article", @station%> -->\
		  </div>');
	getTransitDetail (obj, tabCount);
};

// Delay Voting Button send requirnment to vote
function voteButton(id){
  // console.log(id);
  // currentVote = id;
  // station name  -  transit: departure_stop: name: "DeKalb Av"
  // train  -  transit: line: short_name: "Q"
  // headsign  -  transit: headsign: "Astoria - Ditmars Blvd"
  // Current time
  // var currentDate = new Date();
  // var dateTime = currentDate.getHours() + ":"
  //              + currentDate.getMinutes() + ":"
  //              + currentDate.getSeconds();


  // transit_name - transit_obj: transit: line: name: "Boardway Express"
               
  // $.ajax({
  //   type:'GET',
  //   url:'/welcome/show',
  //   data: { station_name : "DeKalb Av", train : "Q", headsign : "Astoria - Ditmars Blvd", current_time : dateTime, vote :  currentVote},
  //   success:function(data){
  //     //I assume you want to do something on controller action execution success?
  //     //$(this).addClass('done');
  //     console.log(data);
  //     console.log(data[0]);
  //   }
  // });
  
  // Get route time
  // var routeTime = transitObj[0].transit.departure_time.value.getUTCHours() + ":" +
  //                 transitObj[0].transit.departure_time.value.getUTCMinutes() + ":" +
  //                 transitObj[0].transit.departure_time.value.getUTCSeconds();
  // console.log(routeTime);
  
  // Get weekday
  var weekday = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  var routeDay = weekday[transitObj[0].transit.departure_time.value.getDay()];
    
  
  // Get route time
  var theTime = transitObj[0].transit.departure_time.value.toJSON().substr(11, 8);
  
$.ajax({
    type:'GET',
    url:'/welcome/try',
    data: { station_name : transitObj[0].transit.departure_stop.name, train : transitObj[0].transit.line.short_name , headsign : transitObj[0].transit.headsign, day: routeDay, time: theTime},
    success:function(data){
      //I assume you want to do something on controller action execution success?
      //$(this).addClass('done');
    }
  });

$.ajax({
    type:'GET',
    url:'/welcome/prediction_alg',
    data: { station_name : transitObj[0].transit.departure_stop.name, train : transitObj[0].transit.line.short_name , headsign : transitObj[0].transit.headsign, day: routeDay, time: theTime},
    success:function(data){
      //I assume you want to do something on controller action execution success?
      //$(this).addClass('done');
    }
  });
  
  // $.ajax({
  //     type:'GET',
  //     url:'/welcome/prediction_alg',
  //     data: { station_name : "135 St", train : "2" , headsign : "FLATBUSH AV - BROOKLYN COLLEGE", current_time : dateTime, vote :  currentVote, day: "monday", time:"17:36:30"},
  //     success:function(data){
  //       //I assume you want to do something on controller action execution success?
  //       //$(this).addClass('done');
  //     }
  //   });
  
  // Clean up transitObj to prevent redirect to voting page
  transitObj = [];
  // Redirect to info page
  $('#navCarousel').carousel(1);
};

function emailSend () {
  if ($('#feedback-content').val() != '') {
    $.ajax({
      type: 'POST',
      url: 'welcome/submit_feedback',
      data: { 
        replyTo: $('#user-email').val(),
        textarea: $('#feedback-content').val()
      }
    });
    pushMessage ('success', 'Message sent! Thank you!')
  }
  else {
    $('#navCarousel').carousel(0);
    pushMessage ('error', 'Empty Message not sent!');
  }
};

// Differentiate Transit Type for SavedRoute Object
function renderDir (routeObj, routeNum){
  $('#tab0').empty();

  var thisRoute = routeObj.routes[routeNum].legs[0];
  var newInstr = "";
  var trainNum = 1;

  for (var i = 0; i < thisRoute.steps.length; i++) {

    if (thisRoute.steps[i].travel_mode == 'WALKING'){
      newInstr = '<div class="instr">' + thisRoute.steps[i].instructions + '</div>';      
      $('#tab0').append(newInstr);
    }
    // Only check obj which is related to transit
    else if (thisRoute.steps[i].hasOwnProperty('transit') ) {
      // Switch case for vehicle type
      switch(thisRoute.steps[i].transit.line.vehicle.type) {
          case "RAIL":
              newInstr = '<div class="instr">' + thisRoute.steps[i].transit.line.short_name + ' ' + thisRoute.steps[i].instructions + "RAIL </div>";
              $('#tab0').append(newInstr);              
              break;
          case "SUBWAY":
              newInstr =  '<div class="instr"><a href="#tab'+trainNum+'">' + thisRoute.steps[i].transit.line.short_name + ' train to ' + thisRoute.steps[i].transit.arrival_stop.name
              + '<br><span class="subtext">' + thisRoute.steps[i].instructions + '</span></div></a>';
              $('#tab0').append(newInstr);
              trainNum++;
              break;
          case "BUS":
              newInstr = '<div class="instr">' + thisRoute.steps[i].transit.line.short_name + ' ' + thisRoute.steps[i].instructions + '</div>';
              $('#tab0').append(newInstr);
              break;
          case "FERRY":
              newInstr =  '<div class="instr">' + thisRoute.steps[i].instructions + ' ' + 'FERRY </div>';
              $('#tab0').append(newInstr);
              break;
          case "HEAVY_RAIL":
              newInstr ='<div class="instr">' + thisRoute.steps[i].transit.line.name + ' ' + thisRoute.steps[i].instructions + '</div>';
              $('#tab0').append(newInstr);
              break;
          default:
              newInstr ='<div class="instr">' + thisRoute.steps[i].instructions + '</div>';
              $('#tab0').append(newInstr);
              break;
      }
    }
  } // End Steps Loop

  $('#tab0').append (routeObj.routes[routeNum].copyrights);

  $('#tab0 .instr a').on('click', function (e) { 
    e.preventDefault();
    $('a[href="' + $(this).attr('href') + '"]').tab('show');
  });
};

/*
// Markers for current locaiton
var markers = [];
// Store all transit involved route 
var transit_obj = [];

$(document).ready(function(){
  var map;
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
  var lat;
  var lon;
  var hunter = new google.maps.LatLng(40.7687020,-73.9648760);

  function initialize() {

    // Try HTML5 geolocation
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(pos);

        directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
          zoom: 11,
          center: pos
        };
        // Draw map
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        
        var request = {
            origin: pos,
            destination: hunter,
            travelMode: google.maps.TravelMode.TRANSIT
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });

        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }
  }
  else {
    $('#navCarousel').carousel(0);
    pushMessage ('error', 'Empty Message not sent!');
  }
};
*/