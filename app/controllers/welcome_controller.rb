class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  
  def index
    # key = "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
#     @key = key
#     @client = GooglePlaces::Client.new(@key)
#
#     @station = @client.spots(40.7851185, -73.72719089999998, :types => 'subway')
    #puts "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    
    
    # url = 'https://maps.googleapis.com/maps/api/place/details/json?location=40.7851185,-73.72719089999998&radius=500&types=subway&sensor=false&key=AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM'
    # result = open(url) do |file|
    #   JSON.parse(file.read)
    # end
    # @data2 = result
    
    

    baseurl = "https://maps.googleapis.com/maps/api/place/search/json?"
    lat = 40.7851185.to_s
    lng = -73.72719089999998.to_s
    radius = 500.to_s
    type = "subway"
    key = "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"

    #combine = baseurl + 'location=' + lat + ',' + lng  + '&' + 'radius=' + radius + '&' + "types=" + type + '&' + "key=" + key
    combine = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&types=food&name=cruise&key=AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"

    url = combine
    result = open(url) do |file|
      JSON.parse(file.read)
    end
    @data2 = result
    
    geourl = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    georesult = open(geourl) do |file|
      JSON.parse(file.read)
    end
    @data3 = georesult
  end
  
  def station
  end
end
