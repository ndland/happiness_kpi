#= require application

describe "Home View", ->
  beforeEach ->
    @subject = new happiness_kpi.homeView

  it "exists", ->
    expect(@subject).to.exist
