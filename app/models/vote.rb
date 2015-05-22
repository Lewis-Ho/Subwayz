

class Vote < ActiveRecord::Base 
 belongs_to :stop_time 

 #for prev stop regression
 
	def self.sum_xy(tid,dateBigger,dateSmaller) #big query for summing up votes * stop sequences for a time interval for regression formula
    	@v=Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote * stop_times.stop_sequence")
  end

  	def self.sum_xx(tid,dateBigger,dateSmaller) #big query for summing up stop sequence * stop sequence for a time interval for regression formula
  		@v = Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.stop_sequence* stop_times.stop_sequence")
  	
    end
 
 	def self.sum_x(tid,dateBigger,dateSmaller) #big query for summing up stop sequence for a time interval for regression formula
 		  @v = Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.stop_sequence")

  end

 	def self.sum_y(tid,dateBigger,dateSmaller) #big query for summing up votes for a time interval for regression formula 
 		@v = Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote")
 
  end

 	def self.XY_rowCount(tid,dateBigger,dateSmaller) #counting rows for regression formula
 		
   @v = Vote.joins(:stop_time).where(stop_times:{trip_id: tid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).count

  end

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#for same stop regression

 	def self.sum_xy2(rid,sid,dateBigger,dateSmaller) #big query for summing up votes * stop time arrival for a time interval for regression formula
    	Vote.joins(stop_time:[:trip]).where(stop_times:{stop_id: sid}).where(trips:{route_id:rid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote * stop_times.arrival_time_min")
  	end

  	def self.sum_xx2(rid,sid,dateBigger,dateSmaller) #big query for summing up arrival time * arrival time for a time interval for regression formula
		Vote.joins(stop_time:[:trip]).where(stop_times:{stop_id: sid}).where(trips:{route_id:rid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.arrival_time_min * stop_times.arrival_time_min")
	end
 
 	def self.sum_x2(rid,sid,dateBigger,dateSmaller) #big query for summing up arrival time for a time interval for regression formula
 		Vote.joins(stop_time:[:trip]).where(stop_times:{stop_id: sid}).where(trips:{route_id:rid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("stop_times.arrival_time_min")
 	end

 	def self.sum_y2(rid,sid,dateBigger,dateSmaller) #big query for summing up votes for a time interval for regression formula
 		Vote.joins(stop_time:[:trip]).where(stop_times:{stop_id: sid}).where(trips:{route_id:rid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).sum("votes.vote")
 	end

 	def self.XY_rowCount2(rid,sid,dateBigger,dateSmaller) #row count total for regression formula 
 		Vote.joins(stop_time:[:trip]).where(stop_times:{stop_id: sid}).where(trips:{route_id:rid}).where("votes.d_t < ? and votes.d_t > ?", dateBigger, dateSmaller).count
 	end

#-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


end

#
