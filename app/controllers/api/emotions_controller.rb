class Api::EmotionsController < ApplicationController

  # TODO needs to be redone as the 'create' method.
  def create
    emotion = HappinessKpiData.find(params[:id])

    render :json => emotion.to_json(:only => ["emotion", "location"])
  end
end
