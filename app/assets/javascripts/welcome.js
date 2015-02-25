src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"


$(document).ready(function(){
    $('.sixth-train-link').click(function(e){
      e.preventDefault();
      $('.tag').fadeToggle('slow');
      $('.tag').show();
    });

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
              var pos = new google.maps.LatLng(position.coords.latitude,
                                               position.coords.longitude);

              /*var infowindow = new google.maps.InfoWindow({
                map: map,
                position: pos
              });
              */

              var contentString = 'This is where you are right now.'

              var infowindow = new google.maps.InfoWindow({
              content: contentString
              });

              var marker =  new google.maps.Marker({
                position: pos,
                map: map,
                title: 'Uluru (Ayers Rock)'
              });

              google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map,marker);
              
              });

              marker.setMap(map);

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

        var options = {
          map: map,
          position: new google.maps.LatLng(60, 105),
          content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
      }
      
      google.maps.event.addDomListener(window, 'load', initialize);
});

