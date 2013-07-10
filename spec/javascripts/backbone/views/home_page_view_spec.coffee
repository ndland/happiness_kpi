#= require application

happiness_kpi = happiness_kpi || {}
# happiness_kpi.homeView = Backbone.View.extend ->

describe "Home View", ->
  beforeEach ->
    @subject = new happiness_kpi.homeView()

  it "exists", ->
    expect(@subject).to.exist

