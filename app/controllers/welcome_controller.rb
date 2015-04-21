class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  
  def index
  end
  
  def show
    @test = 5;
    #"DeKalb Av" 
    @station_name = params[:station_name];
    #"Q"
    @train = params[:train];
    #"Astoria - Ditmars Blvd"
    @headsign = params[:headsign];
    #dataTime
    @current_time = params[:current_time];
    #transit_name
    @transit_name = params[:transit_name];
    #puts @transit_name;
    
    # Current Vote
    @vote = params[:vote];
    # puts @vote;
    
    ## Modify query to get nearest schedule
    @cal = Route.find_by_sql("select * from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    
    ## Insert vote to vote table
    
    render :json => @cal
  end

  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
