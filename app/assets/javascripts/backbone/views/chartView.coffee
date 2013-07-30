namespace "happiness_kpi", (exports) ->
  exports.chartView = Backbone.View.extend

    el: '#lineChart'

    initialize: ->
      # @buildChart()
      # @getAverageEmotion()
      @emotion = new happiness_kpi.emotions

    buildChart: ->
      chart = new Highcharts.Chart
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
          data: [3, 2.5, 1, 2, 2.7]
        ]

    getDate: (daysPrevious) ->
      moment().subtract('days', daysPrevious).format("YYYY/MM/DD")

    getAverageEmotion: ->
      @emotion.fetch()
