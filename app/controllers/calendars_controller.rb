class CalendarsController < ApplicationController
  def show
    @test = Calendar.find_by(params[:service_id])
  end

 def new
  end
end
