class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  include  StopTimesHelper
  
  def index
  
  end


  def try
    
    
     
    @station_name = params[:station_name];
    #"Q"
    @train = params[:train];
    #"Astoria - Ditmars Blvd"
    @headsign = params[:headsign];
    #dataTime
    @current_time = params[:current_time];
    #transit_name
    @transit_name = params[:transit_name];
    puts @train;

    #v = StopTime.try("monday",@station_name,@train, "07:30:00")
    @test = {}
    #@test = v.pluck(:id)
    keys = [:id, :stop_sequence]
    #values = [v.pluck(:id),v.pluck(:stop_sequence)]
    #@test = Hash[*values]
    #@test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
    Vote.create(stop_time_id: @test[:id],d_t: Time.now, day: "sunday", vote: 1) #time is in UTC (make it ot EST)

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
    
  

   


    # # Current Vote
    # @vote = params[:vote];
    # # puts @vote;
    
    # ## Modify query to get nearest schedule
    
    # #@my_test=Route.find_by_sql("select trips.trip_headsign from routes join trips on routes.route_id='#{@test}' join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    # @tripid = Route.find_by_sql("select trips.trip_id, routes.route_id from routes join trips on routes.route_id='#{@test}' join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    # @stop_arrivingAt= Route.find_by_sql("select stop_times.stop_id from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    # @stop_time=Route.find_by_sql("select stop_times.arrival_time from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    # @stp_time_id=Route.find_by_sql("select stop_times.id from routes join trips on '#{@test}'=routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
    # #@testtest=StopTime.find_by_sql("select stop_times.id from stop_times limit 1")
    # #@day_of_week=Route.find_by_sql("select stop_times.id from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")

    # ## Insert vote to vote table
   
    # #@v = Route.pluck (:trip_id)

   render :json => @station_name
   
  
    # respond_to do |format|
    #   format.html
    #   format.json {render json: @train }
    # end
  end

  # def insert

  #   @station_name = params[:station_name];
  #   #"Q"
  #   @train = params[:train];
  #   #"Astoria - Ditmars Blvd"
  #   @headsign = params[:headsign];
  #   #dataTime
  #   @current_time = params[:current_time];
    
  #   # Current Vote
  #   @vote = params[:vote];



  #   @tripid = Route.find_by_sql("select trips.trip_id, routes.route_id from routes join trips on routes.route_id='#{@test}' join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
  #   @stop_arrivingAt= Route.find_by_sql("select stop_times.stop_id from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
  #   @stop_time=Route.find_by_sql("select stop_times.arrival_time from routes join trips on '#{@test}' =routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")
  #   @stp_time_id=Route.find_by_sql("select stop_times.id from routes join trips on '#{@test}'=routes.route_id join stop_times on trips.trip_id = stop_times.trip_id join stops on stop_times.stop_id = stops.stop_id limit 1")


  # Vote.create(stop_time_id:'' , d_t: Time.now, day: @stop_arrivingAt ,vote:'' )


  # end



  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
