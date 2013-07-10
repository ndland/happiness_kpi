Feature: Home Page

  Scenario: Visiting the home page, I should see three visuals to determine my mood
    Given I am on the home page
    Then I should see three pictures representing my mood

    @WIP
  Scenario: I am able to select one of the images
    Given I am on the home page
    When I select one of the faces
    # Then I should see the image is selected
