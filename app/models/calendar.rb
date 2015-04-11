class Calendar < ActiveRecord::Base 

self.table_name="calendars"
self.primary_key = 'service_id'
has_many :trips
has_many :routes, :through => :trips 

end
