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
    

    @day=params[:day];
    
    @dateNow = DateTime.now.strftime("%Y-%m-%d");
    @dateTom=DateTime.tomorrow.strftime("%Y-%m-%d");
    v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])
    
    keys = [:stop_sequence, :trip_id, :arrival_time, :id]
    values = [v.pluck("stop_times.stop_sequence"),v.pluck(:trip_id),v.pluck("stop_times.arrival_time"), v.pluck("stop_times.id")]
    
    @temp = Hash[*keys.zip(values).flatten] #creates things from array to a hash
    
    
    @sumxy=Vote.sum_xy(@temp[:trip_id],@dateTom,@dateNow);
    @sumXX=Vote.sum_xx(@temp[:trip_id],@dateTom,@dateNow);
    @sumX=Vote.sum_x(@temp[:trip_id],@dateTom,@dateNow);
    @sumY=Vote.sum_y(@temp[:trip_id],@dateTom,@dateNow);
    @xyCount =Vote.XY_rowCount(@temp[:trip_id],@dateTom,@dateNow);

    @slope = ((@xyCount*@sumxy)-((@sumX)*(@sumY)))/((@xyCount*@sumXX)-(@sumX*@sumX)).to_f;

    @intercept = (((@sumY)-(@slope*@sumX))/@xyCount).to_f;


    @rEquation = @intercept +(@slope*@temp[:stop_sequence]).to_f


    @temp_one = (@temp[:id]-@temp[:stop_sequence]+1).to_i;

     g=StopTime.where(id: @temp_one)
    @b=g.pluck(:id,:stop_sequence,:arrival_time,:trip_id)
    # @j=b;

    puts @temp_one;
    puts @b;


   # puts @j;
   #  puts @sumxy;
   #  puts @sumXX;
   #  puts @sumX;
   #  puts @sumY;
   #  puts @xyCount;
   # puts @slope;
   # puts @intercept;
   # puts @rEquation;

end

  





  # def try

    
  #   @current_time_convert=Time.parse(params[:time]); #with date and time
    
  #   @current_time_final=@current_time_convert.strftime("%H:%M:%S"); #final time object to subtract with time_now_ET
    
  #   @time_now_ET=DateTime.now.strftime("%H:%M:%S");

  #       @answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes
        
  #       puts @current_time_final;
  #       puts @time_now_ET;
  #       puts @answer;

  #   #transit_name
  #   @transit_name = params[:transit_name];

  #   @curr_time= params[:time]

  #   v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])
    
  

  #   keys = [:id, :stop_sequence]
  #   values = [v.pluck(:id),v.pluck(:stop_sequence)]
    
  #   @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
  #   puts @test;
  #   Vote.create(stop_time_id: @test[:id],d_t: @time_now_ET, day: params[:day], vote: @answer) #time is in UTC (make it ot EST)

  # end  

  
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
