class WelcomeController < ApplicationController
  require 'google_places'
  require 'rubygems'
  require 'open-uri'
  require 'json'
  require 'time_difference'
  require 'date'
  require 'time'
  include  StopTimesHelper
  
  def index
  
  end


def prediction_alg
  @station_name = params[:station_name];

    #"Q"
    @train = params[:train];

    #"Astoria - Ditmars Blvd"
    @headsign = params[:headsign];

    #dataTime
    @current_time = params[:time]; 
    @current_time_convert=Time.parse(@current_time); #with date and time
    

    @current_time_final=@current_time_convert.strftime("%H:%M:%S"); #final time object to subtract with time_now_ET
    
    @time_now_ET=DateTime.now.strftime("%H:%M:%S");

        @answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes
        # x = [answer.pluck(:minutes)]
        #@answer= ((@current_time_final-@time_now_ET)/60);
       
       
        puts @current_time_final;
        puts @time_now_ET;
        puts @answer;
       

    #transit_name
    @transit_name = params[:transit_name];

    @dayOfWeek= params[:day];

    @curr_time= params[:time]

  

    v = StopTime.try(@dayOfWeek,@station_name,@train, @curr_time)
  
    #@test = v.pluck(:id)

    keys = [:id, :stop_sequence]
    values = [v.pluck(:id),v.pluck(:stop_sequence)]
    #puts values;
    #@test = Hash[*values]
    @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash

end

  





  def try

@headsign=(params[:headsign]);
    @current_time_convert=Time.parse(params[:time]); #with date and time
    

    @current_time_final=@current_time_convert.strftime("%H:%M:%S"); #final time object to subtract with time_now_ET
    
    @time_now_ET=DateTime.now.strftime("%H:%M:%S");

        @answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes
        # x = [answer.pluck(:minutes)]
        #@answer= ((@current_time_final-@time_now_ET)/60);
       
       
        puts @current_time_final;
        puts @time_now_ET;
        puts @answer;
       
       



puts @headsign;
        

    #transit_name
    @transit_name = params[:transit_name];

    

    @curr_time= params[:time]

  

    v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], @headsign)
    
    #@test = v.pluck(:id)

    keys = [:id, :stop_sequence]
    values = [v.pluck(:id),v.pluck(:stop_sequence)]
    #puts values;
    #@test = Hash[*values]
    @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
    puts @test;
    Vote.create(stop_time_id: @test[:id],d_t: @time_now_ET, day: params[:day], vote: @answer) #time is in UTC (make it ot EST)

  end  

  
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
