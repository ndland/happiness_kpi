#= require application

describe "Bar Chart View", ->

  beforeEach ->
    $('body').append('<div id="barChart"></div>')
    @subject = new happiness_kpi.barChartView

    @subject.allEmotionsCollection.add([ date: "2013/07/31", happy: 3, undecided: 0, sad: 4 ])
    @subject.allEmotionsCollection.add([ date: "2013/08/01", happy: 1, undecided: 3, sad: 1 ])
    @subject.allEmotionsCollection.add([ date: "2013/08/03", happy: 2, undecided: 3, sad: 2 ])

  it 'has an el property', ->
    assert.equal(@subject.$el.selector, "#barChart")

  describe '#initialize', ->

    it 'calls the buildChart function', ->
      @subject.buildChart = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.buildChart

    it 'creates a new instance of the "allEmotions" collection', ->
      @subject.initialize()

      expect(@subject.allEmotionsCollection).to.exist

    it 'calls the plotData() function', ->
      spy = sinon.spy @subject, "plotData"

      @subject.initialize()

      sinon.assert.calledOnce @subject.plotData
      @subject.plotData.restore()

  describe '#buildChart', ->

    it 'creates a chart', ->
      assert.isDefined @subject.chart, "chart is defined"

    it 'has a title of "Emotions for last 5 days"', ->
      assert.equal @subject.chart.title.text, "Emotions for last 5 days"

    it 'renders to the correct element', ->
      assert.equal @subject.chart.renderTo.id, "barChart"

  describe "#plotData", ->

    it 'redraws the chart', ->
      @subject.chart.redraw = sinon.spy()

      @subject.plotData()

      sinon.assert.calledThrice @subject.chart.redraw

    it 'sets the dates for the xAxis', ->
      dates = ["2013/07/31", "2013/08/01", "2013/08/02", "2013/08/03", "2013/08/04"]

      assert.deepEqual @subject.chart.xAxis[0].categories, dates

    it 'sets the data for the "happy" emotion', ->
      values = [3, 4, 6, 1, 3]

      assert.deepEqual @subject.chart.series[0].yData, values

    it 'sets the data for the "Undecided" emotion', ->
      values = [2, 5, 7, 1, 2]

      assert.deepEqual @subject.chart.series[1].yData, values

    it 'sets the data for the "Sad" emotion', ->
      values = [3, 5, 2, 1, 5]

      assert.deepEqual @subject.chart.series[2].yData, values

