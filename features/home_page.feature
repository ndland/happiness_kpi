Feature: Home Page

    @javascript
  Scenario: Visiting the home page, I should see three visuals to determine my mood
    Given I am on the home page
    Then I should see three pictures representing my mood

    @javascript
  Scenario: When I click one of the faces, it records the selection in the database
    Given I am on the home page
    When I click on a face
    Then The selection should recorded in the database

    @javascript
  Scenario: Visiting the home page, I should see a link that says reports
    Given I am on the home page
    Then I should see a link that says "Reports"

    @WIP
    @javascript
  Scenario: Clicking the "Reports" link should take me to the reports page
    Given I am on the home page
    When I click on the "Reports" link
    Then I should be directed to the reports page
