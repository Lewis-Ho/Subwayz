class Route < ActiveRecord::Base

  self.primary_key = 'route_id'
  has_many :trips, :primary_key => 'route_id', :foreign_key => 'route_id'
  has_many :calendars, :through => :trips

  def self.foo
    @test = Route.first.trips
  end

end
