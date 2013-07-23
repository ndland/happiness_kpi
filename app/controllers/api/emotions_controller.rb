class Api::EmotionsController < ApplicationController

  def create
    emotion = HappinessKpiData.new(emotion: params[:emotion])

    render :json => emotion.to_json(:only => "emotion")
    emotion.save
  end
end
