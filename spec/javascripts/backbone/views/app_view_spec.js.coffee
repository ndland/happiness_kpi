#= require application

describe "App View", ->
  beforeEach ->
    @subject = new happiness_kpi.appView

  it "exists", ->
    expect(@subject).to.exist

  it "has an render function", ->
    expect(@subject.render).to.exist

  it "has an 'events' property", ->
    expect(@subject).to.have.property('events')
