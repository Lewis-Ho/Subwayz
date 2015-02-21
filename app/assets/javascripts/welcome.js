src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"


$(document).ready(function(){
    $('.sixth-train-link').click(function(e){
      e.preventDefault();
      $('.tag').fadeToggle('slow');
      $('.tag').show();
    });
});