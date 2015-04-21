

class Vote < ActiveRecord::Base 

	def yes
		
	end

	def no
	end

  belongs_to :stop_time 

  def self.foo
    @test= Vote.where(stop_time_id:1, day:'tuesday').count
  end


end

