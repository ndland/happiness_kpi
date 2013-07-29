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

    it 'gets the current date', ->
      assert.equal @subject.getDate(), "2013/7/29"
