#= require application

describe "Bar Chart View", ->

  beforeEach ->
    $('body').append('<div id="barChart"></div>')
    @subject = new happiness_kpi.barChartView

    @happy = []; @undecided = []; @sad = []; @dates = []

    [[ date: "2013/07/31", happy: 3, undecided: 2, sad: 3 ],
     [ date: "2013/08/01", happy: 4, undecided: 5, sad: 5 ],
     [ date: "2013/08/02", happy: 6, undecided: 7, sad: 2 ],
     [ date: "2013/08/03", happy: 1, undecided: 1, sad: 1 ],
     [ date: "2013/08/04", happy: 3, undecided: 2, sad: 5 ]].forEach (value) =>
       @subject.allEmotionsCollection.add(value)
       @happy.push value[0]["happy"]
       @undecided.push value[0]["undecided"]
       @sad.push value[0]["sad"]
       @dates.push value[0]["date"]

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
      stub = sinon.stub(@subject, 'fetchData', (callback) =>
        callback(@dates, @happy, @sad, @undecided)
        )

      @subject.plotData()

      sinon.assert.calledThrice @subject.chart.redraw

    it 'sets the dates for the xAxis before plotting the data', ->
      stub = sinon.stub(@subject, 'fetchData', (callback) =>
        callback(@dates, @happy, @sad, @undecided)
        )

      @subject.plotData()

      assert.include $('.highcharts-axis-labels')[0].textContent, "2013/07/31"

    it 'calls the fetchData() method', ->
      spy = sinon.spy @subject, "fetchData"

      @subject.plotData()

      sinon.assert.calledOnce @subject.fetchData
      @subject.fetchData.restore()


    it 'sets the data for the happy, sad and undecided emotions', ->
      stub = sinon.stub(@subject, 'fetchData', (callback) =>
        callback(@dates, @happy, @sad, @undecided)
        )

      @subject.plotData()

      assert.deepEqual @subject.chart.series[0].yData, @happy
      assert.deepEqual @subject.chart.series[1].yData, @undecided
      assert.deepEqual @subject.chart.series[2].yData, @sad

  describe '#fetchData', ->

    it 'fetches the data from the server', ->
      spy = sinon.spy @subject.allEmotionsCollection, "fetch"

      @subject.fetchData()

      sinon.assert.calledOnce @subject.allEmotionsCollection.fetch
      @subject.allEmotionsCollection.fetch.restore()

    it 'it fetches the dates and values from the collection and calls the callback with the dates and values', (done) ->
      callback = (dates, happy, sad, undecided) =>
        assert.deepEqual ["2013/07/31", "2013/08/01", "2013/08/02", "2013/08/03","2013/08/04",], dates
        assert.deepEqual [3, 4, 6, 1, 3], happy
        assert.deepEqual [2, 5, 7, 1, 2], undecided
        assert.deepEqual [3, 5, 2, 1, 5], sad
        done()

      stub = sinon.stub(@subject.allEmotionsCollection, 'fetch', (options) ->
        options["success"]()
      )

      @subject.fetchData(callback)
