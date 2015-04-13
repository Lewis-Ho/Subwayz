class VotesController < ApplicationController
  

  def show
  	@vote = Vote.find(params[:id])
  end

  def new
  	@vote = Vote.new
  end

  def create
  	@vote = Vote.new(params[:vote])
  	if @vote.save
  		redirect_to new_vote_path
  end
end
end
