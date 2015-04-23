class Calendar < ActiveRecord::Base 

  self.primary_key = 'service_id'
  has_many :trips, :primary_key => 'service_id',:foreign_key => 'service_id'
  has_many :routes, :through => :trips 

  def self.foo
    @test=Calendar.first.trips
  end

   def self.try
    @test=Calendar.joins(:trips)
  end

end
