Given /^I am on the home page$/ do
  visit "/"
end

Then /^I should see three pictures representing my mood$/ do
  find(:css, 'input#happy')
  find(:css, 'input#undecided')
  find(:css, 'input#sad')
end

When /^I click on a face$/ do
  find(:css, '#happy').trigger('click')
end

Then /^I should see the selection recorded in the database$/ do
  HappinessKpiData.count should eq 1
end
