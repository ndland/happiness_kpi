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
          color: "#D0F53A"
          data: []
        }, {
          name: 'Undecided',
          color: "#FFF268"
          data: []
        },
          name: 'Sad',
          color: "#F99E79"
          data: []
        ]

      @plotData()

    plotData: ->
      @fetchData (dates, happy, sad, undecided) =>
        @chart.xAxis[0].categories = dates
        @chart.series[0].setData happy
        @chart.series[1].setData undecided
        @chart.series[2].setData sad

    fetchData: (callback) ->
      dates = []; happy = []; sad = []; undecided = []

      @allEmotionsCollection.fetch success: =>
        @allEmotionsCollection.forEach (eachItem) =>
          dates.push eachItem.get 'date'
          happy.push eachItem.get 'happy'
          sad.push eachItem.get 'sad'
          undecided.push eachItem.get 'undecided'

        callback(dates, happy, sad, undecided)
