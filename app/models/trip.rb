class Trip< ActiveRecord::Base

  self.primary_key = 'trip_id'
  belongs_to :calendar,  :class_name => 'Calendar', :foreign_key => 'service_id'
  belongs_to :route,  :class_name => 'Route', :foreign_key => 'route_id'
  has_many :stop_times, :primary_key => 'trip_id',:foreign_key => 'trip_id'

  def self.foo
    @test = Trip.first.stop_times
  end

end
