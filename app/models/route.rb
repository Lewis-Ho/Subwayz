class Route < ActiveRecord::Base

self.primary_key = 'route_id'
has_many :trips
has_many :calendars, :through => :trips

end
