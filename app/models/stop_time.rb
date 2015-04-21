class StopTime< ActiveRecord::Base 

  has_many :votes
  belongs_to :trip,  :class_name => 'Trip', :foreign_key => 'trip_id'
  belongs_to :stop, :class_name => 'Stop', :foreign_key => 'stop_id'

  def self.foo
    @test = StopTime.first.votes
  end

end
