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
      where("created_at >= ? AND created_at < ?", (date - 30), date + 1)
  end

  def format_query(query)
    average_emotion = {}

    query.each { |model|
      date = model.created_at.strftime("%-d %b")

      average_emotion[date] ||= { "entries" => [] };
      average_emotion[date]["entries"].push model.emotion
    }

    finished = average_emotion.map { |x| average = x[1]["entries"].
      inject{ |sum, s| sum + s } / x[1]["entries"].count.to_f
      { "date" => x[0],
        "value" => average.to_f.round(2) } }
  end
end
