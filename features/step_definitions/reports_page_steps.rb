Given /^I am on the reports page$/ do
  visit '/reports'
end

Then /^I should see a line chart$/ do
  find(:css, '#lineChart')
  within(:css, '#lineChart') do
    page.should have_content('Average Happiness At Atomic Object')
  end
end

Then /^I should see a bar chart$/ do
  find(:css, '#barChart')
  within(:css, '#barChart') do
    page.should have_content('Emotions for last 5 days')
  end
end
