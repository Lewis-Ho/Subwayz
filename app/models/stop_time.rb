class StopTime < ActiveRecord::Base 

  has_many :votes
  belongs_to :trip,  :class_name => 'Trip'  
  belongs_to :stop, :class_name => 'Stop' 

 # def self.foo
  #  @test = StopTime.first.votes
 # end


  def self.try
    test = StopTime.joins(:stop,trip: [:calendar, :route]).where(stops:{stop_name: 'New Lots Av'}).where(calendars: {monday: '1'}).where(routes: {route_id: '3'}).where(routes: {route_short_name: '3'}).where(stop_times: {arrival_time: '09:58:30'})
  end




  def self.retrive_id(x,y,z,r,t,s)
    @m  = StopTime.joins(:stop,trip: [:calendar, :route] ).where(trips:{trip_headsign: x }).where(stop_times:{arrival_time: y}).where(stops:{stop_name: z}).where(calendars: {service_id: r}).where(routes: {route_id: t}).where(routes: {route_short_name: s}).includes(:stop)
  end

  def self.sum
      @test = StopTime.joins(:votes,:stop,trip: [:calendar, :route] ). where(stops:{stop_name: "New Lots Av"}).where(votes: {vote: 1}).where(calendars: {service_id: "A20141207SAT"}).where(routes: {route_id: "3"}).where(routes: {route_short_name: "3"}).count

  end


  def foo
    @foo= StopTime.retrive_id("HARLEM - 148 ST","07:30:00","New Lots Av","A20141207SAT","3","3")
  end
end
