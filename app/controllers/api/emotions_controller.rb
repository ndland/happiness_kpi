class Api::EmotionsController < ApplicationController

  def create
    @emotion = HappinessKpiData.new(emotion: params[:emotion])
    @emotion.save

    render :json => @emotion.emotion
  end

  def index
    all_emotions = HappinessKpiData.all
    render :json => all_emotions.to_json(:only => "emotion")
  end
end
