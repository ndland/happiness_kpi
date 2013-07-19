#= require application

describe "App View", ->
  beforeEach ->
    $("body").append('<div id="display"></div>')
    @subject = new happiness_kpi.appView

  afterEach ->
    $("body").append('<div id="display"></div>').remove()

  it "exists", ->
    expect(@subject).to.exist

  describe "#initialize", ->

    it "exists", ->
      expect(@subject.initialize).to.exist

    it "calls the render function", ->
      @subject.render = sinon.spy()

      @subject.initialize()

      sinon.assert.calledOnce @subject.render

    it "creates a new instance of the 'emotions' model", ->
      expect(@subject.emotion).to.exist

  describe "#render", ->

    it "exists", ->
      expect(@subject.render).to.exist

    it "renders the 'faces' template", ->
      sinon.spy(HandlebarsTemplates, "faces")

      @subject.initialize()

      sinon.assert.calledOnce HandlebarsTemplates.faces
      HandlebarsTemplates.faces.restore()

  describe "#happySelected", ->

    it "exists", ->
      expect(@subject.happySelected).to.exist

    it "is called when the happy face is clicked", ->
      sinon.spy(@subject, "happySelected")
      @subject.delegateEvents()

      $("input#happy").click()

      sinon.assert.calledOnce @subject.happySelected

    it "sets the 'emotion' model's emotion", ->
      $("input#happy").click()

      expect(@subject.emotion.get("emotion")).to.equal(3)

    it "sets the 'emotion' model's location", ->
      $("input#happy").click()

      expect(@subject.emotion.get("location")).to.equal("Detroit")

  describe "#undecidedSelected", ->

    it "exists", ->
      expect(@subject.undecidedSelected).to.exist

    it "is called when the undecided face is clicked", ->
      sinon.spy(@subject, "undecidedSelected")
      @subject.delegateEvents()

      $("input#undecided").click()

      sinon.assert.calledOnce @subject.undecidedSelected

    it "sets the 'emotion' model's emotion", ->
      $("input#undecided").click()

      expect(@subject.emotion.get("emotion")).to.equal(2)

    it "sets the 'emotion' model's location", ->
      $("input#undecided").click()

      expect(@subject.emotion.get("location")).to.equal("Detroit")

  describe "#sadSelected", ->

    it "exists", ->
      expect(@subject.sadSelected).to.exist

    it "is called when the sad face is clicked", ->
      sinon.spy(@subject, "sadSelected")
      @subject.delegateEvents()

      $("input#sad").click()

      sinon.assert.calledOnce @subject.sadSelected

    it "sets the 'emotion' model's emotion", ->
      $("input#sad").click()

      expect(@subject.emotion.get("emotion")).to.equal(1)

    it "sets the 'emotion' model's location", ->
      $("input#sad").click()

      expect(@subject.emotion.get("location")).to.equal("Detroit")
