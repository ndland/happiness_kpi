require 'spec_helper'

describe Api::EmotionsController do

  before do
    @models = [
      [1, '2013-07-30T04:00'],
      [3, '2013-07-31'],
      [2, '2013-08-01'],
      [3, '2013-07-21T04:00'],
      [3, '2013-07-30T04:00'],
      [2, '2013-07-31'],
      [2, '2013-08-10T00:36'],
      [3, '2013-08-09T13:36'],
      [1, '2013-08-01']
    ].map do |emotion, date|
      Fabricate(:happiness_kpi_data, created_at: DateTime.parse(date), emotion: emotion)
    end
  end

  describe "#index" do

    it "calls the format_query function" do
      subject.should_receive(:format_query).and_return([{ date: "21 Aug", value: 3.0}])
      subject.stub(:query)

      get :index

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "value" => 3.0})
    end

    it "calls the query function" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: "21 Aug", value: 3.0}])
      subject.should_receive(:query).and_return(@models)

      get :index

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "value" => 3.0})
    end

    it "passes a date into the query function" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: "21 Aug", value: 3.0 }])
      subject.should_receive(:query).with(DateTime.parse("2013-08-08")).and_return(@models)

      get :index, date: "2013-08-08"

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "value" => 3.0})
    end

    it "uses todays date if there is no date passed in" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: Date.today.to_s(:short), value: 3.0 }])
      subject.should_receive(:query).with(Date.today).and_return(@models)

      get :index
    end

    it "calls the query method itself to render data to JSON" do
      pending
    end
  end

  describe "#create" do

    it "has a status code of 200 for given emotion" do
      get :create, emotion: 3

      response.status.should equal(200)
    end

    it "creates a new record in HappinessKpiData model" do
      get :create, emotion: 3

      HappinessKpiData.count.should eq(10)
    end

    it "stores the correct value for the emotion" do
      get :create, emotion: 2

      HappinessKpiData.last.emotion.should eq(2)
    end
  end

  describe "#query" do

    it "queries the table for 30 days prior to specified date" do
      require 'set'
      subject.query(DateTime.parse("2013-08-12")).to_set.should == @models[0..8].to_set
    end

    it "queries the table for 30 days prior to specified date" do
      require 'set'
      subject.query(DateTime.parse("2013-09-09")).should == [@models[6]]
    end

    it "queries the table for 30 days prior to specified date" do
      require 'set'
      subject.query(Date.parse("2012-07-08")).to_set.should == [].to_set
    end
  end

  describe "#format_query" do

    it "returns an array of hashes for a single given date" do
      subject.format_query([@models[0]]).should == [{ "date" => "30 Jul", "value" => 1 }]
    end

    it "returns an array of hashes for two given dates" do
      subject.format_query(@models[3..4]).should == [{ "date" => "21 Jul", "value" => 3},
                                                     { "date" => "30 Jul", "value" => 3}]
    end

    it "returns an array of hashes for two models of the same date and the average emotion for the two models" do
      subject.format_query(@models[6..7]).should == [{ "date" => "9 Aug", "value" => 2.5}]
    end
  end

  describe "#average_of_array" do

    it "calculates the average of an array" do
      subject.average_of_array([2,3,4]).should eq(3.0)
    end

    it "calculates the average of an array" do
      subject.average_of_array([2, 3, 4, 5, 6, 9]).should eq(4.83)
    end

    it "calculates the average of an array" do
      subject.average_of_array([1]).should eq(1.0)
    end

    it "calculates the average of an array" do
      subject.average_of_array([1, 33, 5, 90]).should eq(32.25)
    end
  end
end
