#= require application

describe "Chart View", ->
  # Configuration
  beforeEach ->
    $('body').append('<div id="lineChart"></div>')
    @subject = new happiness_kpi.chartView

  it 'has an el property', ->
    assert.equal(@subject.$el.selector, "#lineChart")

  describe "#initialize", ->

    # TODO - fix these tests.

    # it 'calls the buildChart function', ->
    #   @subject.buildChart = sinon.spy()

    #   @subject.initialize()

    #   sinon.assert.calledOnce @subject.buildChart

    # it 'calls the getAverageEmotion function', ->
    #   @subject.getAverageEmotion = sinon.spy()

    #   @subject.initialize()

    #   sinon.assert.calledOnce @subject.getAverageEmotion

    it 'creates a new instance of the "emotions" model', ->
      @subject.initialize()

      expect(@subject.emotion).to.exist

  describe "#getDate", ->

    [0, 1, 10, 30].forEach (index) ->
      it 'returns ' + moment().subtract('days', index).format("YYYY/MM/DD") + ' when passed ' + index, ->
        assert.equal @subject.getDate(index), moment().subtract('days', index).format("YYYY/MM/DD")
