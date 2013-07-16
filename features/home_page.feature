Feature: Home Page

  Scenario: Visiting the home page, I should see three visuals to determine my mood
    Given I am on the home page
    Then I should see three pictures representing my mood

    @WIP
    @javascript
  Scenario: When I click one of the faces, it records the selection in the database
    Given I am on the home page
    When I click on a face
    Then I should see the selection recorded in the database
