namespace "happiness_kpi", (exports) ->
  exports.chartView = Backbone.View.extend

    el: '#lineChart'

    initialize: ->
      @buildChart()

    buildChart: ->
      chart = new Highcharts.Chart
        chart:
          type: 'spline'
          renderTo: 'lineChart'

        title:
          text: "Average Happiness"

        xAxis:
          categories: [new Date().getDay() - 2 ]

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

    getDate: (days) ->
      moment().subtract('days', days).format("YYYY/MM/DD")
