#= require application

describe "allEmotions Collection", ->
  beforeEach ->
    @subject = new happiness_kpi.allEmotionsCollection
    @server = sinon.fakeServer.create()
    @server.autoRespond = true

  describe "#url", ->

    it 'does a GET to /api/last_week', (done) ->
      @server.respondWith "GET", "/api/last_week", [200,
        { "Content-Type": "application/json" },
        '[{"date": " 1 Aug", "happy": 2}]']

      callback = (emotionJson) ->
        assert.deepEqual emotionJson, [{"date": " 1 Aug", "happy": 2}]
        done()

      @subject.fetchEmotionJson callback
