class Trip< ActiveRecord::Base

  self.primary_key = 'trip_id'
  belongs_to :calendar
  has_many :stop_times, :primary_key => 'trip_id',:foreign_key => 'trip_id'

  def self.foo
    @test = Trip.first.stop_times
  end

end
