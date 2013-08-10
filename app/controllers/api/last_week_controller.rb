class Api::LastWeekController < ApplicationController

  def index
    date = params[:date] ? Date.parse(params[:date]) : Date.today

    render :json => format_query(query(date))
  end

  def query(date)
    @last_five_days = HappinessKpiData.
      where("created_at >= ? AND created_at < ?", (date - 5), date + 1)
    return @last_five_days
  end

  # TODO Refactor
  def format_query(query)
    sums = {}

    query.each { |model|
      sums[model.created_at.strftime("%-d %b")] ||= { 3 => 0, 2 => 0, 1 => 0 };
      sums[model.created_at.strftime("%-d %b")][model.emotion] += 1
    }

    finshed = sums.map { |x| { "date" => x[0], "happy" => x[1][3], "undecided" => x[1][2], "sad" => x[1][1] } }
  end
end
