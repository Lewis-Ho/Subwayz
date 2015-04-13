class Trip< ActiveRecord::Base

self.primary_key = 'trip_id'
belongs_to :calendar

end
