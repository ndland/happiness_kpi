#= require application

describe "allEmotions Collection", ->
  beforeEach ->
    @subject = new happiness_kpi.allEmotionsCollection
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  describe "#url", ->

    it 'does a GET to /api/emotions/last5days', (done) ->
      @server.respondWith "GET", "/api/emotions/last5days", [200,
        { "Content-Type": "application/json" },
        '[{"date": " 1 Aug", "value": 2}]']

      callback = (emotionJson) ->
        assert.deepEqual emotionJson, [{"date": " 1 Aug", "value": 2}]
        done()

      @subject.fetchEmotionJson callback
