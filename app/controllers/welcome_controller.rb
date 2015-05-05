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
     
      @dateNow = DateTime.now.strftime("%Y-%m-%d");
      @dateTom= DateTime.tomorrow.strftime("%Y-%m-%d");

    
      @sumxy=Vote.sum_xy(tid,@dateTom,@dateNow);
      @sumXX=Vote.sum_xx(tid,@dateTom,@dateNow);
      @sumX=Vote.sum_x(tid,@dateTom,@dateNow);
      @sumY=Vote.sum_y(tid,@dateTom,@dateNow);
      @xyCount =Vote.XY_rowCount(tid,@dateTom,@dateNow);


      @denominator=((@xyCount*@sumXX)-(@sumX*@sumX)).to_f;

      if (@denominator!=0)
      
          @slope = ((@xyCount*@sumxy)-((@sumX)*(@sumY)))/@denominator;

          @intercept = (((@sumY)-(@slope*@sumX))/@xyCount).to_f;


          @rEquation = @intercept +(@slope*stop_seq).to_f;

       else

          @rEquation="No data";

        end
  end




  def same_stop_regression(rid,stop_ID, arrival_time_min)

      @time_now_minusOne = (Time.now - 1.day).strftime("%F %H:%M:%S")
      @time_now=(Time.now).strftime("%F %H:%M:%S")
      @time_now_minusOne;
      

      @sumXY_firstStop = Vote.sum_xy2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumXX_firstStop = Vote.sum_xx2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumX_firstStop = Vote.sum_x2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumY_firstStop = Vote.sum_y2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sum_rows = Vote.XY_rowCount2(rid,stop_ID,@time_now,@time_now_minusOne);

    
      @denominator_2=((@sum_rows*@sumXX_firstStop)-(@sumX_firstStop*@sumX_firstStop)).to_f;
      

      if (@denominator_2!=0)
       
          @slope_new = ((@sum_rows*@sumXY_firstStop)-(@sumX_firstStop*@sumY_firstStop))/@denominator_2;

          @intercept_new = (((@sumY_firstStop)-(@slope_new*@sumX_firstStop))/@sum_rows).to_f;

          @rEquation_new = @intercept_new +(@slope_new* arrival_time_min).to_f;

      else
          @rEquation_new = "No data";

      end

  end
  
  


def prediction_alg
    
#     #prev stop regression



     @dateNow = DateTime.now.strftime("%Y-%m-%d");
     @dateTom=DateTime.tomorrow.strftime("%Y-%m-%d");

      @timeNow = DateTime.now.strftime("%H:%M:%S");

     
    
     v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])
    
     
     keys = [:stop_sequence, :trip_id, :arrival_time, :id,:arrival_time_min,:route_id,:stop_id]
     values = [v.pluck("stop_times.stop_sequence"),v.pluck(:trip_id),v.pluck("stop_times.arrival_time"), v.pluck("stop_times.id"),v.pluck("stop_times.arrival_time_min"), v.pluck("trips.route_id"), v.pluck("stop_times.stop_id")]
     
     @temp = Hash[*keys.zip(values).flatten] #creates things from array to a hash
   

     @firstStop_id = (@temp[:id]-@temp[:stop_sequence]+1).to_i;
     

      
      firstStop_train_info=StopTime.where(id: @firstStop_id)
      keys2=[:id,:stop_sequence,:departure_time,:trip_id]
      val_temp = [firstStop_train_info.pluck(:id),firstStop_train_info.pluck(:stop_sequence),firstStop_train_info.pluck(:departure_time),firstStop_train_info.pluck(:trip_id)]
      @firstStop_answer= Hash[*keys2.zip(val_temp).flatten] #creates things from array to a hash

      @firstStop_answer[:departure_time];

      if (@temp[:stop_sequence]!=1) #person is here
#       #check if train has departed then do previous stop regression
       

      
          if(@firstStop_answer[:departure_time] < @timeNow) 
               
             @ps_regression= prev_stop_regression(@temp[:trip_id], @temp[:stop_sequence]);


           elsif(@firstStop_answer[:departure_time] >= @timeNow)
                
                
                @reg = same_stop_regression(@temp[:route_id], @temp[:stop_id],@temp[:arrival_time_min]);
               
      end   

      elsif (@temp[:stop_sequence]==1)
            
              puts @sstop_regression=same_stop_regression(@temp[:route_id], @temp[:stop_id],@temp[:arrival_time_min]);
        
      end
      
  end
    


  def try
    

    #if(cookies[:vote]!="1")

        @current_time_convert=Time.parse(params[:time]); #with date and time

        @current_time_final=@current_time_convert.strftime("%H:%M:%S"); #final time object to subtract with time_now_ET

            @time_now_ET=DateTime.now.strftime("%H:%M:%S");

            @answer=TimeDifference.between(@current_time_final, @time_now_ET).in_minutes


            

        #transit_name
        @transit_name = params[:transit_name];

        @curr_time= params[:time]

        puts params[:station_name]
        puts v = StopTime.try(params[:day],params[:station_name],params[:train], params[:time], params[:headsign])



        keys = [:id, :stop_sequence]
        values = [v.pluck(:id),v.pluck(:stop_sequence)]

        puts @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
       
        Vote.create(stop_time_id: @test[:id],d_t: @time_now_ET, day: params[:day], vote: @answer) #time is in UTC (make it ot EST)

    #end
    cookies[:vote]= {:value=> "1", :expires=> 2.minutes.from_now}
  end 

  
  
  def create
    @lng_lat = [params[:lng].to_f, params[:lat].to_f]
    @alt = params[:alt].to_f
  end

  def submit_feedback
    @user_email = params[:replyTo]
    @mail_body = params[:textarea]

    Feedback.send_feedback(@user_email, @mail_body).deliver_now
  
    render none: true;
  end

end

  