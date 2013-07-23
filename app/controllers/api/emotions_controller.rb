class Api::EmotionsController < ApplicationController

  def create
    emotion = HappinessKpiData.new(emotion: params[:emotion])
    emotion.save

    render :json => {}
  end
end
