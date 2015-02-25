class WelcomeController < ApplicationController
  require 'google_places'
  require 'json'
  
  def index
    key = "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    @key = key
    @client = GooglePlaces::Client.new(@key)
    
    @station = @client.spots(40.7851185, -73.72719089999998, :types => 'subway')
    #puts "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    
    url = 'https://maps.googleapis.com/maps/api/place/details/json?location=40.7851185,-73.72719089999998&radius=500&types=subway&sensor=false&key=AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM'
    result = open(url) do |file|
      JSON.parse(file.read)
    end
    @data2 = result
    
  end
  
  def station
  end
end
