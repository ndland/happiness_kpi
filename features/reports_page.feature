Feature: Reports Page

    @javascript
  Scenario: When visiting the reports page, I should see a line chart
    Given I am on the reports page
    Then I should see a line chart

    @javascript
  Scenario: When visiting the reports page, I should see a bar chart
    Given I am on the reports page
    Then I should see a bar chart
