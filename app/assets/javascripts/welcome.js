src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"


$(document).ready(function(){
    $('.sixth-train-link').click(function(e){
      e.preventDefault();
      $('.tag').fadeToggle('slow');
      $('.tag').show();
    });

      function initialize() {

      	



        var mapOptions = {
          center: { lat: -34.397, lng: 150.644},
          zoom: 11
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      }
      google.maps.event.addDomListener(window, 'load', initialize);
});

