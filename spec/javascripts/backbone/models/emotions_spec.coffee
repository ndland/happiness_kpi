#= require application

describe "Emotion Collection", ->
  beforeEach ->
    @subject = new happiness_kpi.emotions
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  afterEach ->
    @server.restore()

  describe "#fetchEmotionJson", ->

    it "accesses /api/emotions", (done) ->

      @server.respondWith "GET", "/api/emotions", [200,
        { "Content-Type": "application/json" },
        '[{"date": " 1 Aug", "value": 2}]']

      callback = (emotionJson) ->
        assert.deepEqual emotionJson, [{"date": " 1 Aug", "value": 2}]
        done()

      @subject.fetchEmotionJson callback
