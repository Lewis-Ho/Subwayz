class Welcome < ActiveRecord::Base
  

  #Previous stop, when the stop is in the middle of the trip and 
  #the train already left the first stop on the trip, 
  #the following algorithim is used. 
  def self.prev_stop_regression (tid,stop_seq)  # regression calculation for middle of line
     @rEquation
     
      @dateNow = DateTime.now.strftime("%Y-%m-%d");     #date today
      @dateTom= DateTime.tomorrow.strftime("%Y-%m-%d"); #date tomorrow

      #following are variables for calculating regression function (calculated in VOTE.RB)
      #refer VOTE.RB for INFORMATION
      
      #x represents the previous stop sequences, before the current stop
      #y represents the time of delay of the train, this could be positive or negative
      @sumxy=Vote.sum_xy(tid,@dateTom,@dateNow);  # sum xy
      @sumXX=Vote.sum_xx(tid,@dateTom,@dateNow);  # sum xx 
      @sumX=Vote.sum_x(tid,@dateTom,@dateNow);    # sum x -
      @sumY=Vote.sum_y(tid,@dateTom,@dateNow);    # sum y 
      @xyCount =Vote.XY_rowCount(tid,@dateTom,@dateNow);

     

      @denominator=((@xyCount*@sumXX)-(@sumX*@sumX)).to_f; #formula for regression being calculated for above variable

      if (@denominator!=0)
        
            
             @slope = ((@xyCount*@sumxy)-((@sumX)*(@sumY)))/@denominator;

             @intercept = (((@sumY)-(@slope*@sumX))/@xyCount).to_f;


             @rEquation = (@intercept +@slope*stop_seq).to_i;

             puts "prv st reg"
             puts @rEquation
         

      else
        #if there was no data for previous stops, we return 999.
        @rEquation= 9999;
        puts "else prv reg"
        puts @rEquation

      end
      @rEquation
  end


  #This algorithm is used when it is the first stop, the second stop or a stop that is in the middle
  #but the previous stop does not have information.
  def self.same_stop_regression(rid,stop_ID, arrival_time_min)  #regression for same stop when train hasn't left

     @rEquation_new 

     #x represents the time of arrival in mins. of the trains coming to the station in question
     #y represents the delay, this could be positive or negative
      @time_now_minusOne = (Time.now - 1.day).strftime("%F %H:%M:%S")
      @time_now=(Time.now).strftime("%F %H:%M:%S")
      @time_now_minusOne;
      

      #following are variables for calculating regression function (calculated in VOTE.RB)
      #refer VOTE.RB for INFORMATION
      
      @sumXY_firstStop = Vote.sum_xy2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumXX_firstStop = Vote.sum_xx2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumX_firstStop = Vote.sum_x2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sumY_firstStop = Vote.sum_y2(rid,stop_ID,@time_now,@time_now_minusOne);
      @sum_rows = Vote.XY_rowCount2(rid,stop_ID,@time_now,@time_now_minusOne);

    
      @denominator_2=((@sum_rows*@sumXX_firstStop)-(@sumX_firstStop*@sumX_firstStop)).to_f;
      

      if (@denominator_2!=0)
       
          @slope_new = ((@sum_rows*@sumXY_firstStop)-(@sumX_firstStop*@sumY_firstStop))/@denominator_2;

          @intercept_new = (((@sumY_firstStop)-(@slope_new*@sumX_firstStop))/@sum_rows).to_f;

          @rEquation_new = (@intercept_new + @slope_new* arrival_time_min).to_i;

          puts "same st reg"
          puts @rEquation_new

          
      else
          @rEquation_new = 9999;
          puts "else same"
          puts @rEquation_new

      end
      @rEquation_new

  end



def self.prediction(day,station_name,train,time, headsign)


  # this is for testing purposes, it outputs some comments on the server

          puts "********************************"
          puts "                                 "
          puts "begining"
          puts train
          puts "*********************************"
    


  
   @ps_regression
   
    @timeNow = DateTime.now.strftime("%H:%M:%S");

     @dateNow = Time.now.strftime("%Y-%m-%d")
   
     @dateTom= ((Time.now.strftime("%Y-%m-%d")).to_time + 1.day).strftime("%Y-%m-%d")
     #checking that the query exists in the database
     v = StopTime.stop_time_row(day,station_name,train, ((time).to_time).strftime("%H:%M:%S"), headsign)
    
     if((v.empty?)==false)
     
         keys = [:stop_sequence, :trip_id, :arrival_time, :id,:arrival_time_min,:route_id,:stop_id] #assigning keys
         values = [v.pluck("stop_times.stop_sequence"),v.pluck(:trip_id),v.pluck("stop_times.arrival_time"), v.pluck("stop_times.id"),v.pluck("stop_times.arrival_time_min"), v.pluck("trips.route_id"), v.pluck("stop_times.stop_id")] #assigning values to the keys
    
         @temp = Hash[*keys.zip(values).flatten] #creates things from array to a hash
  

         @firstStop_id = (@temp[:id]-@temp[:stop_sequence]+1).to_i;
     

         firstStop_train_info=StopTime.where(id: @firstStop_id)
         keys2=[:id,:stop_sequence,:departure_time,:trip_id]
         val_temp = [firstStop_train_info.pluck(:id),firstStop_train_info.pluck(:stop_sequence),firstStop_train_info.pluck(:departure_time),firstStop_train_info.pluck(:trip_id)] #plucking things from the query
         @firstStop_answer= Hash[*keys2.zip(val_temp).flatten] #creates things from array to a hash
         #if a person is in a station that is after the second stop
        if (@temp[:stop_sequence]>2)
          
          #for testing purposes
          
          puts "********************************"
          puts "                                 "
          puts @firstStop_answer[:departure_time]
          puts @timeNow
          puts "*********************************"

          #check if train has departed then do previous stop regression

      
            if(@firstStop_answer[:departure_time] < @timeNow) # if time now > departure time
                @ps_regression= Welcome.prev_stop_regression(@temp[:trip_id], @temp[:stop_sequence]);
               @ps_regression
                puts "reg 1"
                puts @ps_regression
                
                #testing purposes

          puts "********************************"
          puts "                                 "
          puts  "reg 1"
          puts @ps_regression
          puts "*********************************"
            end
               
            #if a previous stop regression did not give a value, use the same stop regression
           if (@ps_regression==9999)
                puts "reg ps 999 2"    
                
                  @ps_regression = Welcome.same_stop_regression(@temp[:route_id], @temp[:stop_id],@temp[:arrival_time_min]);
                  puts "reg 999 2"
                puts @ps_regression
                
                #testing purposes

          puts "********************************"
          puts "                                 "
          puts "reg 999 2"
          puts @ps_regression
          puts "*********************************"
            end
               
            #if the train did not leave the first stop, use the same stop regression

        if(@firstStop_answer[:departure_time] >= @timeNow) #when departure time > the time now

             puts "reg 2"    

             #testing purposes

          puts "********************************"
          puts    "reg 2                                "
          puts @firstStop_answer[:departure_time]
          puts @timeNow
          puts "*********************************"
                
                  @ps_regression = Welcome.same_stop_regression(@temp[:route_id], @temp[:stop_id],@temp[:arrival_time_min]);
                  puts "reg 2"
                puts @ps_regression



             
        
      end     
      #if it is the first stop, or second stop, use the same stop regression
      elsif (@temp[:stop_sequence] < 3)


          puts "********************************"
          puts "   reg 3                              "
          puts @temp[:stop_sequence]
          puts "stop sequnce"
          puts "*********************************"
            
             @ps_regression= Welcome.same_stop_regression(@temp[:route_id], @temp[:stop_id],@temp[:arrival_time_min]);
               puts "reg 3"
                puts @ps_regression
             
      end
      
    end
    if((v.empty?)==true)
      puts "empty"

       @ps_regression=9999
      
    end

    #testing pruposes


    puts "********************************"
    puts "                                 "
    puts "end!!!!!!!!!!!!!!!!"
        
    puts "*********************************"
    puts "end"
    @ps_regression  




          puts "********************************"
          puts "                                 "
          puts "end!!!!!!!!!!!!!!!!"
        
          puts "*********************************"

           @ps_regression  



end 




def self.vote(day,station_name,train,time, headsign)


      #calculating the time in minutes for delay (taking time of the trains supposed arrival - the actaul time)    

       @delay= (((Time.now).strftime("%F %H:%M:%S").to_time - ((time).to_time).strftime("%F %H:%M:%S").to_time)/60).to_i 
       
       #finding the station and the time and the train corresponding to the person vote
         v = StopTime.stop_time_row(day,station_name,train,((time).to_time).strftime("%H:%M:%S"), headsign)

        if((v.empty?)==false)

         keys = [:id, :stop_sequence]
         values = [v.pluck(:id),v.pluck(:stop_sequence)]

          @test = Hash[*keys.zip(values).flatten] #creates things from array to a hash
          #storing the vote that consists of time of delay 
          #recorded and all the relavent information associated with that vote
         Vote.create(stop_time_id: @test[:id],d_t: (Time.now).strftime("%F %H:%M:%S"), day: day, vote: @delay) #time is in UTC (make it ot EST)
         
         end 
                      

 
  end 

  
  
end
