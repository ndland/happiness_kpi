require 'spec_helper'

describe Api::EmotionsController do

  describe "#index" do
    before do
      [[1, '2013-07-30'],
       [3, '2013-07-31'],
       [2, '2013-08-01'],
       [3, '2013-07-21'],
       [3, '2013-07-30'],
       [2, '2013-07-31'],
       [1, '2013-08-01']].each do |emotion, date|
        Fabricate(:happiness_kpi_data, created_at: Date.parse(date), emotion: emotion)
      end
    end

    it "creates one value for each given date" do
      get :index

      theJson = JSON.parse(response.body)

      theJson[1]["date"].strip.should eq("30 Jul")
      theJson[2]["date"].strip.should eq("31 Jul")
      theJson[3]["date"].strip.should eq("1 Aug")

      theJson[1]["value"].should eq(2.0)
      theJson[2]["value"].should eq(2.5)
      theJson[3]["value"].should eq(1.5)

      theJson[0].should_not have_key("updated_at")
      theJson[1].should_not have_key("updated_at")
      theJson[2].should_not have_key("updated_at")
    end

    it "renders the JSON in the correct order by date" do
      get :index

      theJson = JSON.parse(response.body)

      theJson[0]["date"].strip.should eq("21 Jul")
    end
  end

  describe "#create" do

    it "has a status code of 200 for given emotion" do
      get :create, emotion: 3

      response.status.should equal(200)
    end

    it "creates a new record in HappinessKpiData model" do
      get :create, emotion: 3

      HappinessKpiData.count.should eq(1)
    end

    it "stores the correct value for the emotion" do
      get :create, emotion: 2

      HappinessKpiData.first.emotion.should eq(2)
    end
  end
end
