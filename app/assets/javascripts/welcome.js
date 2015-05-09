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

  $('#sidebar').click(toggleSidebar);
  $('#deletes').click(deleteTabs);
  $('#routeChange').click(function () {
		var index = $('#routeChange').data('route');
		index = (index+1)%altRouteCount;
    directionsDisplay.setRouteIndex(index);
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
      resizeMap();
    }
  });

  //If the devices orientation changes, resize and recenter map.
  window.addEventListener("orientationchange", function() {
    resizeMap();
  }, false);

  //If the device's resolution changes, resize and recenter map.
  window.addEventListener("resize", function() {
    resizeMap();
  }, false);
  
  // Get address from cookies as array
  var lastSearch = getAllCookies();
  if (lastSearch.length > 0 && lastSearch[0] != "") {
    // Only output the last 3 searches
    lastSearch = lastSearch.slice(-3);
    for (var i = 0; i < lastSearch.length; i++) {
      var a = (lastSearch[i].split('"'))[3];
      var b = (lastSearch[i].split('"'))[7];
      //Use regex to create string of characters before first comma.
      var mask = /^.[^,]+/i;
      a = a.match (mask);
      b = b.match (mask);
  		$('p:contains("Recent Searches:")').after('<a data-pointA="'+a+'" data-pointB="'+b+'">'+a[0]+' to '+b[0]+'</a><br>');
    }
  }
  
  // Timer on after clicked go button
  $('button:contains("Go")').click(function () {
    calcRoute();
    hideMessage();
  });
  
  // Recent button fill in pointA, pointB textbox, search route and redirect to info page
  $('#recent a').click(function () {
    // Get data
    var pointA = this.getAttribute('data-pointA');
    var pointB = this.getAttribute('data-pointB');
    
    // Write to textboxes
    document.getElementById('start').value = pointA;
    document.getElementById('end').value = pointB;
    
    // Search route
    calcRoute(); 
    hideMessage();
    
    // Constantly check user location with station location in every
    window.setInterval(function(){checkLocation(transitObj)},12000);
  });
});

// Redirect to voting page if user is in one of the station they search
function checkLocation(transitObj) {
  // If geolocation available, get position
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {timeout:60000,maximumAge:60000});
  }
  // User updated geolocation to search for station that is match
  for (var j = 0; j < transitObj.length; j++) {
    // console.log(pos.lat());
    // console.log(transitObj[j].transit.departure_stop.location.lat());
    // Check user location with each transit steps station location
    if (pos.lat() == transitObj[j].transit.departure_stop.location.lat() & pos.lng() == transitObj[j].transit.departure_stop.location.lng()) {
      // Found match station
      votingStation = transitObj[0];
      document.getElementById('cur-train').innerHTML = votingStation.transit.line.short_name;
      document.getElementById('cur-station').innerHTML = votingStation.transit.departure_stop.name;
      // Redirect page to vote
      $('#navCarousel').carousel(2);
    }
    
    // // TESTING DATASET
    // if (true) {
    //   // Found match station
    //   votingStation = transitObj[0];
    //   document.getElementById('cur-train').innerHTML = votingStation.transit.line.short_name;
    //   document.getElementById('cur-station').innerHTML = votingStation.transit.departure_stop.name;
    //   // Redirect page to vote
    //   $('#navCarousel').carousel(2);
    // }
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
      console.log('Geocoder failed due to: ' + status);
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
    start += ' New York City';
    end += ' New York City';
  }

  //Adds several things after initial search.
  if ($('button:contains("Go")').data('initial') == true) {
    $('.searchBar button').data('initial', false);
    //Add "Directions" after "Home" button.
    $('.btn.btn-default[data-slide-to="0"]').after('\
        <button class="btn btn-default"\
        data-target="#navCarousel" data-slide-to="1">\
        Directions</button>');
    //Add "Vote" button and jumbotron after "Directions" button.
    /*
    $('.btn.btn-default[data-slide-to="1"]').after('\
        <button class="btn btn-default"\
        data-target="#navCarousel" data-slide-to="2">\
        Vote</button>');
    */
    $('.voting.jumbotron').append('\
      <p>You seem to be near <span id="cur-station"></span>\
      for <span id="cur-train"></span> train.\
      </p><p>Is there any delay?</p>');
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
      
      saveToRecent();  
      // Constantly check user location with station location in every
      window.setInterval(function(){checkLocation(transitObj)},12000);   

      directionsDisplay.setDirections(response);
			altRouteCount = response.routes.length;
			savedRoutes = response;

      // Differentiate transit type
      //diffRoute (savedRoutes);
			printRoute (savedRoutes, 0);
      
      // Write to cookies
      writeCookies(savedRoutes);
      console.log(savedRoutes.routes[0].legs[0].steps[0].distance.value);
      //document.getElementById("testing-current-distance").innerHTML = savedRoutes.routes[0].legs[0].steps[0].distance.value; 
      //Move to next slide when directions have been retrieved.
      if(savedRoutes.routes[0].legs[0].steps[0].distance.value < 400){
        // Constantly check user location with station location in every
        $('#navCarousel').carousel(1);
        resizeMap();
        
        window.setTimeout(
          function(){ 
            console.log(savedRoutes.routes[0].legs[0].steps[0].distance.value);
            // First station as voting station
            votingStation = getFirstStep(transitObj);
            // Redirect to vote page
            $('#navCarousel').carousel(2);
          },
        12000);
        
      } else {
        // Redirect to map info page, make sure the map is centered
        $('#navCarousel').carousel(1);
        resizeMap();
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

//Saves point A to B onto cookie.
function saveToRecent () {
  //Needs to prevent storing duplicate points.

  // Save point A & B to cookies
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var valueString = '"pointA"="' + start + '","pointB"="' + end + '"'; 
  
  // Create cookies
  createCookie('data',valueString,9999);
      var vals = readCookie('data');
  // for(var i = 0; i < vals.length; i++) {
  //   //console.log(vals[i]);
  //       console.log(vals[3]);
  //       console.log(vals[7]);
  // }
};

// Write info to cookies
function writeCookies (routeObj){
  getAlltransit(routeObj);
  getFirstStep(transitObj);
};

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
};

// Get first step which consist transit info
function getFirstStep (transitObj){
  // transitObj node name steps 
  if (transitObj.length > 0) {
    return transitObj[0];
  }
};

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
};  

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

function resizeMap () {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
}

//Get details from Maps API json object
function getTransitDetail(obj, tabNo){
	var parent='';
	if (tabNo) {
		parent='div#tab'+tabNo+' ';
	}
  console.log("TAB");
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
  var month = obj.transit.departure_time.value.getMonth()+1;
  var theTime = obj.transit.departure_time.value.getFullYear() +'-'+ 
                month +'-'+ 
                obj.transit.departure_time.value.getDate() +' '+ 
                obj.transit.departure_time.value.toTimeString().substr(0, 8);
  
  // Get prediction info
  $.ajax({
      type:'GET',
      url:'/welcome/prediction_alg',
      data: { station_name : obj.transit.departure_stop.name, train : obj.transit.line.short_name , headsign : obj.transit.headsign, day: routeDay, time: theTime},
      success:function(data){
        // 9999 means no enough data, but we still show no delay as result
        if (data == 9999 || data == 0) {
          $(parent+'#predict-info').text("Train Status: There is no delay. Enjoy your ride!");
        }
        // Show different result
        else { 
          $(parent+'#predict-info').text("Train Status: Please expected " +data+ " mins delay");
        }
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
			'<div class="col-xs-11 col-xs-height col-sm-12 col-sm-height">\
			  <p id="train"></p>\
		    <p id="train-stop-depart"></p>\
        <p id="train-stop-end"></p>\
        <p id="num-stop"></p>\
        <p id="duration"></p>\
		    <p id="departure_time"></p>\
        <p id="predict-info"></p>\
		  </div>');
      
      //<p id="arrival_time"></p>\
      //<p id="distance"></p>\
        
	getTransitDetail (obj, tabCount);
};

//Get details from Maps API json object
function getTransitDetail(obj, tabNo){
  var parent='';
  if (tabNo) {
    parent='div#tab'+tabNo+' ';
  }

  $(parent+'#train').text(obj.transit.line.short_name + ' Train');
  $(parent+'#train-stop-depart').text('From station: ' +obj.transit.departure_stop.name);
  $(parent+'#train-stop-end').text('Destination: ' +obj.transit.arrival_stop.name);
  $(parent+'#num-stop').text("Number of stops: " +obj.transit.num_stops);
  // $(parent+'#arrival_time').text('MTA says it arrives at: '+obj.transit.arrival_time.text);
  $(parent+'#departure_time').text('MTA says it arrives at: ' + obj.transit.departure_time.text);
  //$(parent+'#distance').text(obj.distance.text);
  $(parent+'#duration').text('Expected traveling time: ' +obj.duration.text);
  
  // Get weekday
  var weekday  = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
  var routeDay = weekday[obj.transit.departure_time.value.getDay()];
  
  // Get route time
  var month   = obj.transit.departure_time.value.getMonth()+1;
  var theTime = obj.transit.departure_time.value.getFullYear() +'-'+ 
                month +'-'+ 
                obj.transit.departure_time.value.getDate() +' '+ 
                obj.transit.departure_time.value.toTimeString().substr(0, 8);
  
  // Get prediction info
  $.ajax({
      type:'GET',
      url:'/welcome/prediction_alg',
      data: { station_name : obj.transit.departure_stop.name, train : obj.transit.line.short_name , headsign : obj.transit.headsign, day: routeDay, time: theTime},
      success:function(data){
        // 9999 means no enough data, but we still show no delay as result
        if (data == 9999 || data == 0) {
          $(parent+'#predict-info').text("Train Status: There is no delay. Enjoy your ride!");
        }
        // Show different result
        else { 
          $(parent+'#predict-info').text("Train Status: Please expected " +data+ " mins delay");
        }
      }
    });
};

// Delay Voting Button send requirnment to vote, temporary return nearest schedule
// Hardcode Data for database query function
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
  
  // Redirect to info page without calling prediction function
  if (id=='no'){    
    // Clean up transitObj to prevent redirect to voting page
    transitObj = [];
    // Redirect to info page
    $('#navCarousel').carousel(1);
  } 
  // Write prediction function, then redirect to info page
  else {
    // Get weekday
    var weekday  = new Array('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');
    var routeDay = weekday[transitObj[0].transit.departure_time.value.getDay()];
  
    // Get route time
    var month   = transitObj[0].transit.departure_time.value.getMonth()+1;
    var theTime = transitObj[0].transit.departure_time.value.getFullYear() +'-'+ 
                  month +'-'+ 
                  transitObj[0].transit.departure_time.value.getDate() +' '+ 
                  transitObj[0].transit.departure_time.value.toTimeString().substr(0, 8);
  
    $.ajax({
      type:'GET',
      url:'/welcome/try',
      data: { station_name : transitObj[0].transit.departure_stop.name, train : transitObj[0].transit.line.short_name , headsign : transitObj[0].transit.headsign, day: routeDay, time: theTime},
      success:function(data){
        //I assume you want to do something on controller action execution success?
        //$(this).addClass('done');
      }
    });
  
    readCookie('data');
    // Clean up transitObj to prevent redirect to voting page
    transitObj = [];
    // Redirect to info page
    $('#navCarousel').carousel(1);
  }
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
          case "SUBWAY":
              newInstr =  '<div class="instr"><a href="#tab'+trainNum+'">'
              + '<img src="'+ thisRoute.steps[i].transit.line.icon 
              + '" alt="' + thisRoute.steps[i].transit.line.short_name + '">' + ' Train to '
              + thisRoute.steps[i].transit.arrival_stop.name
              + '<br><span class="subtext">towards ' + thisRoute.steps[i].transit.headsign + ' for '
              + thisRoute.steps[i].transit.num_stops + ' stop';
              //If stop needs to be plural i.e. stops...
              if (thisRoute.steps[i].transit.num_stops > 1) newInstr += 's';
              newInstr += '</span></div></a>';
              $('#tab0').append(newInstr);
              trainNum++;
              break;
          case "BUS":
              newInstr = '<div class="instr">' 
              + '<span style="background-color: ' + thisRoute.steps[i].transit.line.color + '; '
              + 'color: white; padding-left: 5px; padding-right: 5px;">' + thisRoute.steps[i].transit.line.short_name + '</span>'
              + ' Bus to ' + thisRoute.steps[i].transit.arrival_stop.name
              + '<br><span class="subtext">towards ' + thisRoute.steps[i].transit.headsign + ' for '
              + thisRoute.steps[i].transit.num_stops + ' stop';
              //If stop needs to be plural i.e. stops...
              if (thisRoute.steps[i].transit.num_stops > 1) newInstr += 's';
              newInstr += '</span></div>';
              $('#tab0').append(newInstr);
              break;
          case "FERRY":
              newInstr = '<div class="instr">' 
              +'<img src="' + thisRoute.steps[i].transit.line.vehicle.icon + '">'
              + 'Ferry to ' + thisRoute.steps[i].transit.arrival_stop.name
              + '<br><span class="subtext">towards ' + thisRoute.steps[i].transit.headsign
              +  '</span></div>';
              $('#tab0').append(newInstr);
              break;
          default:
              newInstr ='<div class="instr">' + thisRoute.steps[i].instructions + '</div>';
              $('#tab0').append(newInstr);
              break;
      }
    }
  } // End Steps Loop

  $('#tab0').append ('<p>Estimated Time of Arrival: '+thisRoute.arrival_time.text+'</p>');
  $('#tab0').append ('<p>'+routeObj.routes[routeNum].copyrights+'<p>');

  $('#tab0 .instr a').on('click', function (e) { 
    e.preventDefault();
    $('a[href="' + $(this).attr('href') + '"]').tab('show');
  });
};

// Randomly create word in size of 5
function randomText(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

// Set Cookies
function createCookie(name,value,days) {
  if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toUTCString();
	}
	else var expires = "";
  // Write to new cookies if cookies does not exist, else append on existing cookies
  if (document.cookie == ""){
    document.cookie = name+"="+value+expires+"; path=/";
  } else {
    // Append on existing cookies
    document.cookie = randomText()+"="+value+expires+"; path=/";
  }
};

// Read Cookies
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i].split('"');
    console.log(c);
    return c;
		//while (c.charAt(0)==' ') c = c.substring(1,c.length);
		//if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
};

// Return all cookies in array
var getAllCookies = function(){
  var pairs = document.cookie.split(";");
  return pairs;
};