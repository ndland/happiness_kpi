Given /^I am on the home page$/ do
  visit "/"
end

Then /^I should see three pictures representing my mood$/ do
  page.should have_xpath("//img[@src=\"happy.jpeg\"]")
end
