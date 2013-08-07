namespace "happiness_kpi", (exports) ->
  exports.chartView = Backbone.View.extend

    el: '#lineChart'

    initialize: ->
      @emotionCollection = new happiness_kpi.emotionsCollection
      @buildChart()

    buildChart: ->
      @chart = new Highcharts.Chart
        chart:
          type: 'spline'
          renderTo: 'lineChart'

        title:
          text: "Average Happiness At Atomic Object"

        xAxis:
          categories: []

        yAxis:
          title:
            text: 'Happiness Level'
          plotLines: [
            value: 0,
            width: 1,
          ]

        series: [
          color: '#329693'
          name: 'Average Happiness'
          data: []
        ]

      @plotData()

    plotData: ->
      @fetchData (dates, values) =>
        @chart.xAxis[0].categories = dates
        @chart.series[0].setData values

    fetchData: (callback) ->
      dates = []; values = []

      @emotionCollection.fetch success: =>
        @emotionCollection.forEach (eachItem) =>
          values.push eachItem.get 'value'
          dates.push eachItem.get 'date'

        callback(dates, values)
