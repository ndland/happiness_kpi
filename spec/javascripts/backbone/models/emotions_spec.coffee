#= require application

describe "Emotion Model", ->
  beforeEach ->
    @subject = new happiness_kpi.emotions
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  afterEach ->
    @server.restore()

  it "exists", ->
    expect(@subject).to.exist

  it "accesses /api/emotions", (done) ->
    callback = ->
      done()

    @server.respondWith "POST", "/api/emotions", [200,
      "Content-Type": "application/json",
      '{}']

    myEmotion = new happiness_kpi.emotions
    myEmotion.save null,
      success: callback

