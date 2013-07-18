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

    it "returns '3' when a user selects the happy face", ->
      $("input#happy").click()

      expect(@subject.happySelected()).to.equal(3)

  describe "#undecidedSelected", ->

    it "exists", ->
      expect(@subject.undecidedSelected).to.exist

    it "is called when the undecided face is clicked", ->
      sinon.spy(@subject, "undecidedSelected")
      @subject.delegateEvents()

      $("input#undecided").click()

      sinon.assert.calledOnce @subject.undecidedSelected

    it "returns '2' when a user selects the undecided face", ->
      $("input#undecided").click()

      expect(@subject.undecidedSelected()).to.equal(2)

  describe "#sadSelected", ->

    it "exists", ->
      expect(@subject.sadSelected).to.exist

    it "is called when the sad face is clicked", ->
      sinon.spy(@subject, "sadSelected")
      @subject.delegateEvents()

      $("input#sad").click()

      sinon.assert.calledOnce @subject.sadSelected

    it "returns '1' when a user selects the sad face", ->
      $("input#sad").click()

      expect(@subject.sadSelected()).to.equal(1)
