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

  describe "#buildChart", ->

  describe "#getDate", ->

    [0, 1, 10, 30].forEach (index) ->
      it 'returns ' + moment().subtract('days', index).format("YYYY/MM/DD") + ' when passed ' + index, ->
        assert.equal @subject.getDate(index), moment().subtract('days', index).format("YYYY/MM/DD")
