class Api::EmotionsController < ApplicationController

  def show
    emotion = HappinessKpiData.find(params[:id])

    render :json => emotion.to_json(:only => ["emotion", "location"])
  end
end
