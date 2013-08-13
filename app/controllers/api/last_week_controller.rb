class Api::LastWeekController < ApplicationController

  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.today

    render :json => format_query(query(date))
  end

  def query(date)
    @last_five_days = HappinessKpiData.
      where("created_at >= ? AND created_at <= ?", (date.beginning_of_day - 5.days), date.end_of_day)
    return @last_five_days
  end

  # TODO Refactor
  def format_query(query)
    sums = {}

    query.each { |model|
      date = model.created_at.strftime("%-d %b")

      sums[date] ||= { 3 => 0, 2 => 0, 1 => 0 };
      sums[date][model.emotion] += 1
    }

    sums.map { |key, value| { "date" => key, "happy" => value[3], "undecided" => value[2], "sad" => value[1] } }
  end
end
