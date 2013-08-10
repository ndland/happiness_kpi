require 'spec_helper'

describe Api::LastWeekController do

  before do
    @models = [
      [1, '2013-08-03'],
      [3, '2013-08-04'],
      [2, '2013-08-04'],
      [3, '2013-08-05'],
      [3, '2013-08-06'],
      [2, '2013-08-07'],
      [1, '2013-08-01'],
      [3, '2013-08-01']
    ].map do |emotion, date|
      Fabricate(:happiness_kpi_data, created_at: Date.parse(date), emotion: emotion)
    end
  end

  describe "#index" do

    it "calls the format_query function" do
      subject.should_receive(:format_query).and_return([{ date: "21 Aug", happy: 5, undecided: 1, sad: 0 }])
      subject.stub(:query)

      get :index

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "happy" => 5, "undecided" => 1, "sad" => 0 })
    end

    it "calls the query function" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: "21 Aug", happy: 5, undecided: 1, sad: 0 }])
      subject.should_receive(:query).and_return(@models)

      get :index

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "happy" => 5, "undecided" => 1, "sad" => 0 })
    end

    it "passes a date into the query function" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: "21 Aug", happy: 5, undecided: 1, sad: 0 }])
      subject.should_receive(:query).with(Date.parse("2013-08-08")).and_return(@models)

      get :index, date: "2013-08-08"

      theJson = JSON.parse(response.body)

      theJson[0].should eq({ "date" => "21 Aug", "happy" => 5, "undecided" => 1, "sad" => 0 })
    end

    it "uses todays date if there is no date passed in" do
      subject.should_receive(:format_query).
        with(@models).
        and_return([{ date: Date.today.to_s(:short), happy: 5, undecided: 1, sad: 0 }])
      subject.should_receive(:query).with(Date.today).and_return(@models)

      get :index
    end

    it "calls the query method itself to render data to JSON" do
      pending
    end
  end

  describe "#query" do

    it "queries the table for 5 days prior to specified date" do
      require 'set'
      subject.query(Date.parse("2013-08-08")).to_set.should == @models[0..5].to_set
    end

    it "queries the table for 5 days prior to specified date" do
      require 'set'
      subject.query(Date.parse("2013-08-02")).to_set.should == @models[6..7].to_set
    end

    it "queries the table for 5 days prior to specified date" do
      require 'set'
      subject.query(Date.parse("2012-07-08")).to_set.should == [].to_set
    end
  end

  describe "#format_query" do

    it "returns an array of hashes for a single given date" do
      subject.format_query([@models[0]]).should == [{ "date" => "3 Aug", "happy" => 0, "undecided" => 0, "sad" => 1 }]
    end

    it "returns an array of hashes for two given dates" do
      subject.format_query(@models[3..4]).should == [{ "date" => "5 Aug", "happy" => 1, "undecided" => 0, "sad" => 0 },
                                                       { "date" => "6 Aug", "happy" => 1, "undecided" => 0, "sad" => 0 }]
    end
  end
end
