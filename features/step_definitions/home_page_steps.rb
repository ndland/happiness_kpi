Given /^I am on the home page$/ do
  visit "/"
end

Then /^I should see three pictures representing my mood$/ do
  find(:css, 'input#happy')
  find(:css, 'input#undecided')
  find(:css, 'input#sad')
end

When /^I click on a face$/ do
  find(:css, '#happy').click()
end

Then /^The selection should recorded in the database$/ do
  sleep 1
  HappinessKpiData.count.should eq(1)
end

Then /^I should see a link that says "Reports"$/ do
  find_link("Reports")
end

When /^I click on the "(.*?)" link$/ do |reports|
  click_link reports
end

Then /^I should be directed to the reports page$/ do
  current_path.should eq("/reports")
end
