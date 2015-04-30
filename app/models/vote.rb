

class Vote < ActiveRecord::Base 
 belongs_to :stop_time 
 
	def self.sum_xy(tid,dateBigger,dateSmaller)
    	Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote * stop_times.stop_sequence")
  	end

  	def self.sum_xx(tid,dateBigger,dateSmaller)
  		Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.stop_sequence* stop_times.stop_sequence")
  	end
 
 	def self.sum_x(tid,dateBigger,dateSmaller)
 		Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.stop_sequence")
 	end

 	def self.sum_y(tid,dateBigger,dateSmaller)
 		Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote")
 	end

 	def self.XY_rowCount(tid,dateBigger,dateSmaller)
 		Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).count
 	end


  def self.foo
    @test= Vote.where(stop_time_id:1, day:'tuesday').count
  end


end

#
