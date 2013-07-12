Given /^I am on the home page$/ do
  visit "/"
end

Then /^I should see three pictures representing my mood$/ do
  page.should have_xpath("//img[@src=\"/assets/smiley.jpg\"]")
  page.should have_xpath("//img[@src=\"/assets/undecided.jpg\"]")
  page.should have_xpath("//img[@src=\"/assets/sad.jpg\"]")
end

When /^I click on a face$/ do
  page.find(:css, '#happy').click
end


Then /^I should see the selection recorded in the database$/ do
  HappinessKpiData.count should eq 1
end
