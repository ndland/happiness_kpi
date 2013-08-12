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
      date = model.created_at.strftime("%-d %b")

      sums[date] ||= { 3 => 0, 2 => 0, 1 => 0 };
      sums[date][model.emotion] += 1
    }

    finished = sums.map { |x| { "date" => x[0], "happy" => x[1][3], "undecided" => x[1][2], "sad" => x[1][1] } }
  end
end
