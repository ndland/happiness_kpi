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
