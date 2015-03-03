src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"

var directionsDisplay;
var directionsService;

$(document).ready(function(){
  directionsService = new google.maps.DirectionsService();
  
  function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
      zoom: 13
    };

  //GEO
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // var infowindow = new google.maps.InfoWindow({
        //   map: map,
        //   position: pos,
        //   content: 'Location found using HTML5.'
        // });
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Current Location'
        });
        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      // Browser doesn't support Geolocation
      handleNoGeolocation(false);
    }

    function handleNoGeolocation(errorFlag) {
      if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
      } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
      }

      var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
      };

      var infowindow = new google.maps.InfoWindow(options);
      map.setCenter(options.position);
    }

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var control = document.getElementById('control');
    control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }
  google.maps.event.addDomListener(window, 'load', initialize);
});

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.TRANSIT
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
      var route = response.routes[0];
      console.log(route);
      for (var i = 0; i < route.legs.length; i++) {
        console.log (route.legs[i].start_address);
        console.log (route.legs[i].end_address);
        console.log (route.legs[i].distance.text);
      }
    }
  });
  // var route = response.routes[0];
  // var summaryPanel = document.getElementById('directions_panel');
  // summaryPanel.innerHTML = '';
  // // For each route, display summary information.
  // for (var i = 0; i < route.legs.length; i++) {
  //   var routeSegment = i + 1;
  //   console.log (summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>');
  //   console.log (summaryPanel.innerHTML += route.legs[i].start_address + ' to ');
  //   console.log (summaryPanel.innerHTML += route.legs[i].end_address + '<br>');
  //   console.log (summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>');
  //   //summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
  //   //summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
  //   //summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
  //   //summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
  // }
};

function hideMessage(){
  $('#init-message').hide(1000);
};

$(this).click(function(e) {
  //console.log($(event.target).text());
  var text = $(event.target).html();
  console.log(text);
  document.getElementById("info").innerHTML = text;
  $("#info").html(text);
  //var element = document.getElementById("info");
  //element.innerHTML = String($(event.target).text());
  //$('#info').show(1000);
});
/*
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

*/

