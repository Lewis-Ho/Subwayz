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


  def prev_stop_regression (tid,stop_seq)
     
     # @dateNow = DateTime.now.strftime("%Y-%m-%d");
     # @dateTom=DateTime.tomorrow.strftime("%Y-%m-%d");

    @dateNow = DateTime.yesterday.strftime("%Y-%m-%d");
     @dateTom=DateTime.now.strftime("%Y-%m-%d");

    @sumxy=Vote.sum_xy(tid,@dateTom,@dateNow);
    @sumXX=Vote.sum_xx(tid,@dateTom,@dateNow);
    @sumX=Vote.sum_x(tid,@dateTom,@dateNow);
    @sumY=Vote.sum_y(tid,@dateTom,@dateNow);
    @xyCount =Vote.XY_rowCount(tid,@dateTom,@dateNow);

    puts @sumxy;
    puts @sumXX;
    puts @sumX;
    puts @sumY;
    puts @xyCount;

    @denominator=((@xyCount*@sumXX)-(@sumX*@sumX)).to_f;

    if (@denominator!=0)
      
        @slope = ((@xyCount*@sumxy)-((@sumX)*(@sumY)))/@denominator;

        @intercept = (((@sumY)-(@slope*@sumX))/@xyCount).to_f;


        @rEquation = @intercept +(@slope*stop_seq).to_f;

    else

        @rEquation="No data";

    end
  end




  def same_stop_regression(rid,stop_ID)

      @time_now_minusOne = (Time.now - 2.day).strftime("%F %H:%M:%S")
      @time_now=(Time.now).strftime("%F %H:%M:%S")
      puts @time_now_minusOne;

      @sumXY_firstStop = Vote.sum_xy2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumXX_firstStop = Vote.sum_xx2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumX_firstStop = Vote.sum_x2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumY_firstStop = Vote.sum_y2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sum_rows = Vote.XY_rowCount2(rid,stop_ID,@time_now,@time_now_minusOne);

      @denominator_2=((@sum_rows*@sumXX_firstStop)-(@sumX_firstStop*@sumX_firstStop)).to_f;

      if (@denominator_2!=0)
       
          @slope_new = ((@sum_rows*@sumXY_firstStop)-(@sumX_firstStop*@sumY_firstStop))/@denominator_2;

          @intercept_new = (((@sumY_firstStop)-(@slope_new*@sumX_firstStop))/@sum_rows).to_f;

          @rEquation_new = @intercept_new +(@slope_new*@temp_new[:arrival_time_min]).to_f;

      else
          @rEquation_new = "No data";

      end

  end
  
  


# def prediction_alg
    
#     #prev stop regression


#     # @day=params[:day];

#     # @dateNow = DateTime.now.strftime("%Y-%m-%d");
#     # @dateTom=DateTime.tomorrow.strftime("%Y-%m-%d");

#       @timeNow = DateTime.now.strftime("%H:%M:%S");

#       puts "time now is below"
#       puts @timeNow;
#       puts @r;
#       puts @timeyest;
    
#      v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])
    
#     keys = [:stop_sequence, :trip_id, :arrival_time, :id,:departureT]
#     values = [v.pluck("stop_times.stop_sequence"),v.pluck(:trip_id),v.pluck("stop_times.arrival_time"), v.pluck("stop_times.id"),v.pluck("stop_times.departure_time")]
    
#     @temp = Hash[*keys.zip(values).flatten] #creates things from array to a hash
#     puts @temp;

#     @firstStop_id = (@temp[:id]-@temp[:stop_sequence]+1).to_i;
#     puts @firstStop_id;

      
#      firstStop_train_info=StopTime.where(id: @firstStop_id)
#       keys2=[:id,:stop_sequence,:departure_time,:trip_id]
#       val_temp = [firstStop_train_info.pluck(:id),firstStop_train_info.pluck(:stop_sequence),firstStop_train_info.pluck(:departure_time),firstStop_train_info.pluck(:trip_id)]
#      @firstStop_answer= Hash[*keys2.zip(val_temp).flatten] #creates things from array to a hash

#     puts @firstStop_answer[:departure_time];

#     if (@temp[:stop_sequence]!=1) #person is here
#       #check if train has departed then do previous stop regression
#       puts "i'm past stop sequence test";

      
#           if(@firstStop_answer[:departure_time] < @timeNow) 
#               puts "i'm past departure time < time now";
#              @ps_regression= prev_stop_regression(@temp[:trip_id], @temp[:stop_sequence]);
#              puts "ps regression";
#              puts  @ps_regression;

              
          

#           elsif(@firstStop_answer[:departure_time] >= @timeNow)
#             puts "i'm past departure time > time now";
#               @reg = same_stop_regression(@temp[:route_id], @temp[:stop_id]);
#           end    


#           elsif (@temp[:stop_sequence==1])
#               puts "i'm past stop _ seq =1";
#               @sstop_regression=same_stop_regression(@temp[:route_id], @temp[:stop_id]);
        
#   end
    
#     # @sumxy=Vote.sum_xy(@temp[:trip_id],@dateTom,@dateNow);
#     # @sumXX=Vote.sum_xx(@temp[:trip_id],@dateTom,@dateNow);
#     # @sumX=Vote.sum_x(@temp[:trip_id],@dateTom,@dateNow);
#     # @sumY=Vote.sum_y(@temp[:trip_id],@dateTom,@dateNow);
#     # @xyCount =Vote.XY_rowCount(@temp[:trip_id],@dateTom,@dateNow);

#     # @slope = ((@xyCount*@sumxy)-((@sumX)*(@sumY)))/((@xyCount*@sumXX)-(@sumX*@sumX)).to_f;

#     # @intercept = (((@sumY)-(@slope*@sumX))/@xyCount).to_f;


#     # @rEquation = @intercept +(@slope*@temp[:stop_sequence]).to_f


#     # @temp_one = (@temp[:id]-@temp[:stop_sequence]+1).to_i;

#     #  g=StopTime.where(id: @temp_one)
#     # @b=g.pluck(:id,:stop_sequence,:arrival_time,:trip_id)
    


# # regression function for first stop on a line

#     #@answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes

#       #same stop 
#       # @time_now_minusOne = (Time.now - 2.day).strftime("%F %H:%M:%S")
#       # @time_now=(Time.now).strftime("%F %H:%M:%S")
#       # puts @time_now_minusOne;

      
      

      
#       #puts @temp_new;
      
#       # @sumXY_firstStop = Vote.sum_xy2(@temp_new[:route_id],@temp_new[:stop_id],@time_now,@time_now_minusOne);
#       # @sumXX_firstStop = Vote.sum_xx2(@temp_new[:route_id],@temp_new[:stop_id],@time_now,@time_now_minusOne);
#       # @sumX_firstStop = Vote.sum_x2(@temp_new[:route_id],@temp_new[:stop_id],@time_now,@time_now_minusOne);
#       # @sumY_firstStop = Vote.sum_y2(@temp_new[:route_id],@temp_new[:stop_id],@time_now,@time_now_minusOne);
#       # @sum_rows = Vote.XY_rowCount2(@temp_new[:route_id],@temp_new[:stop_id],@time_now,@time_now_minusOne);

#       # @slope_new = ((@sum_rows*@sumXY_firstStop)-(@sumX_firstStop*@sumY_firstStop))/((@sum_rows*@sumXX_firstStop)-(@sumX_firstStop*@sumX_firstStop)).to_f;

#       # @intercept_new = (((@sumY_firstStop)-(@slope_new*@sumX_firstStop))/@sum_rows).to_f;

#       # @rEquation_new = @intercept_new +(@slope_new*@temp_new[:arrival_time_min]).to_f;

#       # puts @sumXY_firstStop;
#       # puts @sumXX_firstStop;
#       # puts @sumX_firstStop;
#       # puts @sumY_firstStop;
#       # puts @sum_rows;

#       # puts "----"
#       # puts @slope_new;

#       # puts "-----"
#       # puts @intercept_new;
#       # puts @rEquation_new;
    
   

# end

  

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



  def try

    if(cookies[:vote]!="1")

        @current_time_convert=Time.parse(params[:time]); #with date and time

        @current_time_final=@current_time_convert.strftime("%H:%M:%S"); #final time object to subtract with time_now_ET

            @time_now_ET=DateTime.now.strftime("%H:%M:%S");

            @answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes

            puts @current_time_final;
            puts @time_now_ET;
            puts @answer;

        #transit_name
        @transit_name = params[:transit_name];

        @curr_time= params[:time]

        v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])



        keys = [:id, :stop_sequence]
        values = [v.pluck(:id),v.pluck(:stop_sequence)]

        @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
        puts @test;
        Vote.create(stop_time_id: @test[:id],d_t: @time_now_ET, day: params[:day], vote: @answer) #time is in UTC (make it ot EST)

    end
    cookies[:vote]= {:value=> "1", :expires=> 2.minutes.from_now}
  end 

  
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end
end
