namespace "happiness_kpi", (exports) ->
  exports.barChartView = Backbone.View.extend

    el: '#barChart'

    initialize: ->
      @allEmotionsCollection = new happiness_kpi.allEmotionsCollection
      @buildChart()

    buildChart: ->
      @chart = new Highcharts.Chart
        chart:
          type: 'column'
          renderTo: 'barChart'

        title:
          text: 'Emotions for last 5 days'

        xAxis:
          categories: []

        yAxis:
          min: 0
          title:
            text: 'Number of selections for each emotion'

        tooltip:
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true

        plotOptions:
          column:
            pointPadding: 0.2,
            borderWidth: 0

        series: [{
          name: 'Happy',
          data: []
        }, {
          name: 'Undecided',
          data: []
        },
          name: 'Sad',
          data: []
        ]

      @plotData()

    plotData: ->
      @chart.xAxis[0].categories = ["2013/07/31", "2013/08/01", "2013/08/02", "2013/08/03", "2013/08/04"]
      @chart.series[0].setData [3, 4, 6, 1, 3]
      @chart.series[1].setData [2, 5, 7, 1, 2]
      @chart.series[2].setData [3, 5, 2, 1, 5]
