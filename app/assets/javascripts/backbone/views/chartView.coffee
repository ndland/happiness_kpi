namespace "happiness_kpi", (exports) ->
  exports.chartView = Backbone.View.extend

    el: '#lineChart'

    initialize: ->
      @buildChart()
      @emotionCollection = new happiness_kpi.emotionsCollection
      @plotData()

    buildChart: ->
      @chart = new Highcharts.Chart
        chart:
          type: 'spline'
          renderTo: 'lineChart'

        title:
          text: "Average Happiness"

        xAxis:
          categories: []

        yAxis:
          title:
            text: 'Happiness Level'
          plotLines: [
            value: 0,
            width: 1,
            color: '#808080'
          ]

        legend:
          layout: 'vertical'
          align: 'right'
          verticalAlign: 'middle'
          borderWidth: 0

        series: [
          name: 'Happiness'
          data: []
        ]


    plotData: ->
      dates = []
      value = []

      @emotionCollection.fetch(success: =>

        @emotionCollection.forEach (date) =>
          value.push date.get('value')
          dates.push date.get('date')

          @chart.series[0].setData value
          @chart.xAxis[0].categories = dates)
