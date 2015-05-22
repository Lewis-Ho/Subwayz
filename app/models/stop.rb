class Stop < ActiveRecord::Base

  self.primary_key = 'stop_id'
  has_many :stop_times, :class_name => 'StopTime', :primary_key => 'stop_id',:foreign_key =>'stop_id' 
  has_many :trips, :through => :stop_times


end
