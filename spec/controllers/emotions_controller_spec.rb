require 'spec_helper'

describe Api::EmotionsController do

  describe "#index" do

    it "fetches all of the emotions" do
      10.times do
        Fabricate(:happiness_kpi_data)
      end

      get :index

      HappinessKpiData.count.should eq(10)
    end

    it "only renders the emotion field" do
      Fabricate(:happiness_kpi_data)

      get :index

      theJson = JSON.parse(response.body)

      theJson[0].should have_key("emotion")

      theJson[0].should_not have_key("created_at")
      theJson[0].should_not have_key("updated_at")
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
