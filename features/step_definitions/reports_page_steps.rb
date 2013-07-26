Given /^I am on the reports page$/ do
  visit '/reports'
end

Then /^I should see a chart$/ do
  find(:css, '#lineChart')
end
