class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  
  def index

    # baseurl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
    # lat = -33.8670522.to_s
    # lng = 151.1957362.to_s
    # radius = 500.to_s
    # type = "subway_station"
    # key = "AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    #
    # # Show All Nearest Station
    # #combine = baseurl + 'location=' + lat + ',' + lng  + '&' + 'radius=' + radius + '&' + "types=" + type + '&' + "key=" + key
    # combine = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.695076256618954,-73.9809462044349&radius=500&types=subway_station&key=AIzaSyBEDBGSYZACJSTFx3EBAUpi7Ni90VWA5hM"
    #
    # #@pos = params[:selectingCommand]
    # @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    # @alt = params[:alt].to_f
    #
    # url = combine
    # result = open(url) do |file|
    #   JSON.parse(file.read)
    # end
    # @data2 = @lng_lat
  end
  
  def station
  end
  
  def show
   # @route_number = Route.find_by(params[5])
   # @ser_tri_headsign = Trip.find_by(params[:@route_number])
   # @st_times = StopTime.find_by(params[:@ser_tri_headsign])
   # @stopz = Stop.find_by(params[:@st_times])

   @test = 5;

   @cal = Route.find_by_sql("select * from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
  end

  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
