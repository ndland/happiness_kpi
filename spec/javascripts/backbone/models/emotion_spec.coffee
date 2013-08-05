#= require application

describe "Emotion Model", ->
  beforeEach ->
    @subject = new happiness_kpi.emotion
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  afterEach ->
    @server.restore()

  describe "#url", ->

    it "does a POST to /api/emotions", (done) ->
      callback = ->
        done()

      @server.respondWith "POST", "/api/emotions", [200,
        { "Content-Type": "application/json" },
        '{}']

      @subject.save null, success: callback
