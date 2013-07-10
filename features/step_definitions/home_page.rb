Given /^I am on the home page$/ do
  visit "/"
end

Then /^I should see three pictures representing my mood$/ do
  page.should have_xpath("//img[@src=\"/assets/happy.jpeg\"]")
  page.should have_xpath("//img[@src=\"/assets/undecided.jpeg\"]")
  page.should have_xpath("//img[@src=\"/assets/sad.jpeg\"]")
end

When /^I select one of the faces$/ do
  find('#happy')
  click('#happy')
end
