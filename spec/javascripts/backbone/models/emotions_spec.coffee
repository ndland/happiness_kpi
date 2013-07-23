#= require application

describe "Emotion Model", ->
  beforeEach ->
    @subject = new happiness_kpi.emotions
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  afterEach ->
    @server.restore()

  describe "#url", ->

    it "accesses /api/emotions", (done) ->
      callback = ->
        done()

      @server.respondWith "POST", "/api/emotions", [200,
        "Content-Type": "application/json",
        '{}']

      @subject.save null,
        success: callback
