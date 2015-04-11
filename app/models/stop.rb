class Stop < ActiveRecord::Base

self.primary_key = 'stop_id'
has_many :stop_times
has_many :trips, :through => :stop_times

end
