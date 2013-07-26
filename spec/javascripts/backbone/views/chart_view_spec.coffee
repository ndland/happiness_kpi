#= require application

describe "Chart View", ->
  # Configuration
  beforeEach ->
    @subject = new happiness_kpi.chartView

  it 'has an el property', ->
    console.log @subject
    @subject.$el
    assert.isArray(el, "el is an Array")

  describe "#initialize", ->

    it '', ->
      @subject.initialize
