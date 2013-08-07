class Api::EmotionsController < ApplicationController

  def create
    @emotion = HappinessKpiData.new(emotion: params[:emotion])
    @emotion.save

    render :json => {}
  end

  def index
    result = HappinessKpiData.order('DATE(created_at)').group('DATE(created_at)').average('emotion')

    data = result.map do |date, averageEmotion|
      { date: date.to_date.to_s(:short), value: averageEmotion.to_f.round(2) }
    end

    render :json => data
  end
end
