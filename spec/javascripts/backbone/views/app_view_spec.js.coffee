#= require application

describe "App View", ->
  beforeEach ->
    @subject = new happiness_kpi.appView

  it "exists", ->
    expect(@subject).to.exist

  it "has an events function", ->
    expect(@subject.events).to.exist
