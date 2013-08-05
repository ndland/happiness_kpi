#= require application

describe "Chart View", ->
  # Configuration
  beforeEach ->
    $('body').append('<div id="lineChart"></div>')
    @subject = new happiness_kpi.chartView

  it 'has an el property', ->
    assert.equal(@subject.$el.selector, "#lineChart")

  describe "#initialize", ->

    it 'calls the buildChart function', ->
      @subject.buildChart = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.buildChart

    it 'creates a new instance of the "emotionCollection" collection', ->
      @subject.initialize()

      expect(@subject.emotionCollection).to.exist

  describe "#buildChart", ->

    it 'creates a chart', ->
      assert.isDefined @subject.chart, "chart is defined"

    it 'has a title of "Average Happiness"', ->
      assert.equal @subject.chart.title.text, "Average Happiness"

    it 'renders to the correct element', ->
      assert.equal @subject.chart.renderTo.id, "lineChart"

  describe "#plotData", ->

    beforeEach ->
      @subject.emotionCollection.add([ date: "2013/07/31", value: 3 ])
      @subject.emotionCollection.add([ date: "2013/08/01", value: 1 ])
      @subject.emotionCollection.add([ date: "2013/08/03", value: 2 ])

    it 'redraws the chart', ->
      spy = sinon.spy(@subject.chart, "redraw")

      @subject.plotData()

      assert spy.calledOnce

    # it 'calls plotData()', ->
    #   spy = sinon.spy @subject, "plotData"

    #   @subject.plotData()

    #   sinon.assert.calledOnce @subject.plotData
    #   @subject.plotData.restore()

    # it 'sets data series property to plotData()', ->
    #   @subject.plotData()
    #   values = [3, 1, 2]

    #   console.log @subject.chart

    #   [0, 1, 2].forEach (i) =>
    #     assert.deepEqual @subject.chart.series[0].data[i].y, values[i]

    # it 'sets xAxis property to plotData()', ->
    #   @subject.plotData()

    #   assert.deepEqual @subject.chart.xAxis[0].categories, ["2013/07/31", "2013/08/01", "2013/08/03"]
