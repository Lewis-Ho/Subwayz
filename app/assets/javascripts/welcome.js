src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"

var directionsDisplay;
var directionsService;
var geocoder;
var currentAddress = 'placeholder';
var tabCount = 0;
var altRouteCount = 0;
var savedRoutes;
// Store all transit involved route 
var transit_obj = [];

$(document).ready(function(){

  $('#message-container').hide (0);
  document.getElementById('sidebar').className = 'sidebar-hidden';
  // Keeps form pointAB from refreshing the page.
  $('#pointAB').on('submit', function (e) { 
  	e.preventDefault(); 
  });

  $('#tabs').tab();
  $('#tabs a').click( function (e) { 
  	e.preventDefault();
  	$(this).tab('show');
  });

  $('#sidebar #togglebtn').click(toggleSidebar);
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
    
    var map;
    var pos;
    
    // Default pos for map will be center of Manhattan
    if(!pos){
      pos = new google.maps.LatLng(40.784148400000000000, -73.966140699999980000);
    }
    
    var mapOptions = {
      zoom: 13
    };
  
    getAddress();

    // Draw Map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    map.setCenter(pos);
    
    // Google Direction text route
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    //Needed to resize maps 
    google.maps.event.addDomListener (map, 'idle', function(){
      google.maps.event.trigger (map, 'resize');
    });

  }
  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);

});

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

function successCallback(position){
  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  //Reverse geocoding for current location
  geocoder.geocode({'latLng': pos}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results.length != 0) {
        currentAddress = results[0].formatted_address;
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
};

function errorCallback(){
  
};

fillAddress = function() {
  if (currentAddress != 'placeholder') {
    $('#start').val (currentAddress);  
    pushMessage ('success', "Got your current location!");
  }
  else {
    pushMessage ('warn', 'Please share your location to use this feature.');
  }
};

// Set route and request direction result 
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

  var request = {
    origin: start,
    destination: end,
    provideRouteAlternatives: true,
    travelMode: google.maps.TravelMode.TRANSIT
  };

  deleteTabs();

  directionsService.route(request, function(response, status) {
    console.log(response);
    transit_obj = response.routes.legs;
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
			altRouteCount = response.routes.length;
			savedRoutes = response;

			printRoute (savedRoutes, 0);

      //Move to next slide when directions have been retrieved.
      $('#navCarousel').carousel('next');
      //Disable loading icon pseudocode.
      //$('#loadingIcon').hide(300);
      savedRoutes = response;
    }
    else {
      //If DirectionsStatus.NOT_FOUND 
      //or DirectionsStatus.ZERO_RESULTS
      pushMessage ('error', 'No directions found.');
    }
  });
};

function printRoute (routeObj, routeNo) {
	// Get route object
  var thisRoute = routeObj.routes[routeNo].legs[0];
  
  for (var i = 0; i < thisRoute.steps.length; i++) {
  	// Find all possible transit
    if (typeof thisRoute.steps[i].transit != 'undefined' 
     	&& thisRoute.steps[i].transit.line.vehicle.type == "SUBWAY") {
      	trainTab (thisRoute.steps[i]);
    }
  }
}

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
	console.log ('New Tab.');

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
		$('ul#tabs li a[href="#'+thisTab+'"]').remove();
		//Remove contents of tab
		$('#'+thisTab).remove();
		tabCount--;
	}

	tabCount = 1;

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
		    <!-- <%= link_to "an article", @station%> -->\
		  </div>');
	getTransitDetail (obj, tabCount);
};

// Delay Voting Button send requirnment to vote, temporary return nearest schedule
// Hardcode Data for database query function
function voteButton(id){
  console.log(id);
  currentVote = id;
  // station name  -  transit: departure_stop: name: "DeKalb Av"
  // train  -  transit: line: short_name: "Q"
  // headsign  -  transit: headsign: "Astoria - Ditmars Blvd"
  // Current time
  var currentDate = new Date(); 
  var dateTime = currentDate.getHours() + ":"  
               + currentDate.getMinutes() + ":" 
               + currentDate.getSeconds();


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


$.ajax({
    type:'GET',
    url:'/welcome/try',
    data: { station_name : "Canal St", train : "Q", headsign : "ASTORIA - DITMARS BLVD", current_time : dateTime, vote :  currentVote, day:"monday", time:"10:10:00"},
    success:function(data){
      //I assume you want to do something on controller action execution success?
      //$(this).addClass('done');
      console.log(data);
      console.log(data[0]);
    }
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

  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    // Center map if geolocaiton not supported
    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }

  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);

  //var haight = new google.maps.LatLng(37.7699298, -122.4469157);
  //var oceanBeach = new google.maps.LatLng(40.695076256618954, -73.9809462044349);

  
  // Change station info dynamically base on clicking on route section 
  $("#directions-panel").click(function(e) {
    var content = $(e.target).html();
    var theObj = $(e.target);
    console.log(e);
    if ( content != "" ) {
      // Click on route part that contain subway, get parent html tag for subway information
      if (content.toLowerCase().indexOf("subway") > -1) {
        // Current tag related to saved subway route
        showTransit(transit_obj, content);
      }
      else {
        // Check every element in transit_obj, if one of them exist then print the related subway route 
        for (var i = 0; i < transit_obj.length; i++) {
          console.log(transit_obj[i]);
          switch (e.toElement.innerText) {
            // Arrival Stop
            case transit_obj[i].transit.arrival_stop.name:
              console.log(1);
              getTransitDetail(transit_obj[i]);
              break;
            // Arrival Time
            case transit_obj[i].transit.arrival_time.text:
              console.log(2);
              getTransitDetail(transit_obj[i]);
              break;
            // Staion Stop
            case transit_obj[i].transit.departure_stop.name:
              console.log(3);
              getTransitDetail(transit_obj[i]);
              break;
            // Departure Time
            case transit_obj[i].transit.departure_time.text:
              console.log(4);
              getTransitDetail(transit_obj[i]);
              break;
            // Distance
            case transit_obj[i].distance.text:
              console.log(5);
              getTransitDetail(transit_obj[i]);
              break;
            // Duration 
            case transit_obj[i].duration.text:
              console.log(6);
              getTransitDetail(transit_obj[i]);
              break;
            // Number of stops
            case transit_obj[i].transit.num_stops + " stops":
              console.log(7);
              getTransitDetail(transit_obj[i]);
              break;
          }
        }
      }
    }
  });
  
  /*
  // Query google map
  function initialize() {
    var mapOptions = {
      //center: { lat: -34.397, lng: 150.644},
      zoom: 11
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
        
    // Try HTML5 geolocation
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          console.log(position.coords.latitude,position.coords.longitude);
          
          // $.post('/',{lat: position.coords.latitude,
          //                             lng: position.coords.longitude,
          //                             alt:position.coords.altitude });
          
          var contentString = 'This is where you are right now.'

          // // Send client geolocaiton to controller
          // $.ajax({
          //   type:'post',
          //   url:'/',
          //   data: { selectingCommand : JSON.stringify.pos},
          //   success:function(){
          //     //I assume you want to do something on controller action execution success?
          //     //$(this).addClass('done');
          //   }
          // });

          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          var marker =  new google.maps.Marker({
            position: pos,
            map: map,
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
          });

          // Set marker
          marker.setMap(map);
          // Set geolocation as center
          map.setCenter(pos);

        }, function() {
          handleNoGeolocation(true);
        });

      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }
  }
  
  // Output error message when fail to get geolocation
  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }
  
  // Load Map
  google.maps.event.addDomListener(window, 'load', initialize);
  */

  /*
  $('.sixth-train-link').click(function(e){
    e.preventDefault();
    $('.tag').fadeToggle('slow');
    $('.tag').show();
    //console.log(position.coords.latitude,position.coords.longitude);
  });
});

// If content 
function showTransit(transit_obj, content){
  // Retrieve route from array
  var current_route;
  for (var i = 0; i < transit_obj.length; i++) {
    console.log(transit_obj[i].instructions + " + " + content);
    if (transit_obj[i].instructions.indexOf(content) !=- 1){
      current_route = transit_obj[i];
      break;
    }
  }
  // Print transit detail
  getTransitDetail(current_route);
};

// Hide current location marker on google map 
function hideMarker(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
};
*/