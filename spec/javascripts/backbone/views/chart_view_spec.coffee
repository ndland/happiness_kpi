#= require application

describe "Chart View", ->
  # Configuration
  beforeEach ->
    $('body').append('<div id="lineChart"></div>')
    @subject = new happiness_kpi.chartView

    @subject.emotionCollection.add([ date: "2013/07/31", value: 3 ])
    @subject.emotionCollection.add([ date: "2013/08/01", value: 1 ])
    @subject.emotionCollection.add([ date: "2013/08/03", value: 2 ])

    @dates = []
    @values =[]

    @subject.emotionCollection.forEach (eachItem) =>
      @values.push eachItem.get 'value'
      @dates.push eachItem.get 'date'

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

    it 'calls the plotData() function', ->
      spy = sinon.spy @subject, "plotData"

      @subject.initialize()

      sinon.assert.calledOnce @subject.plotData
      @subject.plotData.restore()

  describe "#buildChart", ->

    it 'creates a chart', ->
      assert.isDefined @subject.chart, "chart is defined"

    it 'has a title of "Average Happiness"', ->
      assert.equal @subject.chart.title.text, "Average Happiness"

    it 'renders to the correct element', ->
      assert.equal @subject.chart.renderTo.id, "lineChart"

  describe "#plotData", ->

    it 'calls the fetchData() method', ->
      spy = sinon.spy @subject, "fetchData"

      @subject.plotData()

      sinon.assert.calledOnce @subject.fetchData
      @subject.fetchData.restore()

    it 'sets data series property to plotData()', ->
      stub = sinon.stub(@subject, 'fetchData', (callback) =>
        callback(@dates, @values)
      )

      @subject.plotData()

      [0, 1, 2].forEach (i) =>
        assert.deepEqual @subject.chart.series[0].data[i].y, @values[i]

      assert.deepEqual @subject.chart.xAxis[0].categories, @dates

    it 'sets the categories before the setData', ->
      stub = sinon.stub(@subject, 'fetchData', (callback) =>
        callback(@dates, @values)
        )

      @subject.plotData()

      assert.include $('.highcharts-axis-labels')[0].textContent, "2013/07/31"

  describe "#fetchData", ->

    it 'fetches the data from the server', ->
      spy = sinon.spy @subject.emotionCollection, "fetch"

      @subject.fetchData()

      sinon.assert.calledOnce @subject.emotionCollection.fetch
      @subject.emotionCollection.fetch.restore()

    it 'it fetches the dates and values from the collection and calls the callback with the dates and values', (done) ->
      callback = (dates, values) =>
        assert.deepEqual ["2013/07/31", "2013/08/01", "2013/08/03"], dates
        assert.deepEqual [3, 1, 2], values
        done()

      stub = sinon.stub(@subject.emotionCollection, 'fetch', (options) ->
        options["success"]()
      )

      @subject.fetchData(callback)


