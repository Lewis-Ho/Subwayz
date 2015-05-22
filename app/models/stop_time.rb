class StopTime < ActiveRecord::Base 

  has_many :votes
  belongs_to :trip,  :class_name => 'Trip'  
  belongs_to :stop, :class_name => 'Stop' 

 # def self.foo
  #  @test = StopTime.first.votes
 # end

 #a query that joins 5 tabled together in order to get stop time ID associated w/ the variables passed from the front end
def self.stop_time_row (day,sname,rid,time_google,headsign)
    
      
  #the mta distinguish saturday from the rest of the days of the week
      if day == "saturday" #checking that the day is saturday
         test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {saturday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
         
  
       #the mta distinguish sunday from the rest of the days of the week
      elsif day == "sunday" #checking that the day is sunday
         test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {sunday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
         

         #all the weekdays have the same schedule in the mta database
      else
            #all the days of the WEEKDAY
            test = StopTime.joins(:stop,trip: [:calendar, :route]).where(trips:{trip_headsign: headsign }).where(stops:{stop_name: sname}).where(calendars: {monday: "1"}).where(routes: {route_short_name: rid}).where(stop_times: {departure_time: time_google})
          
       end
  end

      
  
  

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  def self.retrive_id(x,y,z,r,t,s)
    @m  = StopTime.joins(:stop,trip: [:calendar, :route] ).where(trips:{trip_headsign: x }).where(stop_times:{arrival_time: y}).where(stops:{stop_name: z}).where(calendars: {service_id: r}).where(routes: {route_id: t}).where(routes: {route_short_name: s}).includes(:stop)

  end










end
