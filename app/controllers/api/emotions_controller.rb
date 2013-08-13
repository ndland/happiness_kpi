class Api::EmotionsController < ApplicationController

  def create
    @emotion = HappinessKpiData.new(emotion: params[:emotion])
    @emotion.save

    render :json => {}
  end

  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.today

    render :json => format_query(query(date))
  end

  def query(date)
    result = HappinessKpiData.
      where("created_at >= ? AND created_at <= ?", (date.beginning_of_day - 30.days), date.end_of_day)
  end

  def format_query(query)
    average_emotion = {}

    query.each { |model|
      date = model.created_at.strftime("%-d %b")

      average_emotion[date] ||= { "entries" => [] };
      average_emotion[date]["entries"].push model.emotion
    }

    average_emotion.map { |key, value|
      { "date" => key, "value" => average_of_array(value["entries"]) }}
  end

  def average_of_array(array)
    average = array.inject(:+) / array.count.to_f
    return average.round(2)
  end
end
