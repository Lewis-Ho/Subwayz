class StopTime < ActiveRecord::Base 

  has_many :votes
  belongs_to :trip,  :class_name => 'Trip'  
  belongs_to :stop, :class_name => 'Stop' 

 # def self.foo
  #  @test = StopTime.first.votes
 # end


def self.stop_time_row (day,sname,rid,time_google,headsign)
    #make function for different days of the week (weekday/weekend) using the variables that lewis passes
      

      if day == "saturday"
         test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {saturday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
         
  

      elsif day == "sunday"
         test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {sunday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
         


      else

            test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {monday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
          
       end
  end

      
  
  

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  def self.retrive_id(x,y,z,r,t,s)
    @m  = StopTime.joins(:stop,trip: [:calendar, :route] ).where(trips:{trip_headsign: x }).where(stop_times:{arrival_time: y}).where(stops:{stop_name: z}).where(calendars: {service_id: r}).where(routes: {route_id: t}).where(routes: {route_short_name: s}).includes(:stop)

  end

  def self.sum
      @test = StopTime.joins(:votes,:stop,trip: [:calendar, :route] ). where(stops:{stop_name: "New Lots Av"}).where(votes: {vote: 1}).where(calendars: {service_id: "A20141207SAT"}).where(routes: {route_id: "3"}).where(routes: {route_short_name: "3"}).count

  end


  def foo
      test = StopTime.joins(:trip).where(trips:{route_id: "3" }).where(stop_times:{stop_id: "257N"}).where(calendars: {saturday: "1"}).where(routes: {route_id: rid}).where(stop_times: {arrival_time: time_google})
  end











end
