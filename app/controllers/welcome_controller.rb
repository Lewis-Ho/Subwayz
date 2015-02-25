class WelcomeController < ApplicationController
  require 'google_places'
  
  def index
    key = "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    @key = key
    @client = GooglePlaces::Client.new(key)
    
    @station = @client.spots(40.7851185, -73.72719089999998, :types => 'subway')
    #puts "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
  end
  
  def station
  end
end
