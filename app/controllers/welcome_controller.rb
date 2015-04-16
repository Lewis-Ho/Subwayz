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
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end

  def submit_feedback
    @user_email = params[:replyTo]
    /@type = params[:topic]/
    @contents = params[:textarea]


    /Feedback.email_feedback (@user_email, @contents)/
    Feedback.send_feedback (@contents)

    render nothing: true
  end


end
