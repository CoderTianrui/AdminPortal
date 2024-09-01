import { render, screen,fireEvent } from '@testing-library/react';
import SurveyManagementPage from '../app/surveymanagement/page';
import '@testing-library/jest-dom';
import React from 'react'
beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {}
      };
    };
  });
test('renders the SurveyManagementPage and checks for basic elements', () => {
    render(<SurveyManagementPage />);

    // Verify that "Survey Management" is present in the document
    const surveyManagementElements = screen.queryAllByText((content, element) => {
        return content.includes('Survey Management');
    });
    expect(surveyManagementElements.length).toBeGreaterThan(0);
});

test('submits a new survey and displays it in the list', () => {
    render(<SurveyManagementPage />);
    
    // Open the survey modal
    fireEvent.click(screen.getByText(/Create Survey/i));
    
    // Fill out the survey form
    fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'New Survey' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter description/i), { target: { value: 'This is a new survey' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter recipient/i), { target: { value: 'students' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));
    
    // Verify that the new survey appears in the list
    const newSurveyElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'New Survey';
    });
    expect(newSurveyElements.length).toBeGreaterThan(0);
    
    const newSurveyDescElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'This is a new survey';
    });
    expect(newSurveyDescElements.length).toBeGreaterThan(0);
});

test('deletes a survey from the list', () => {
    render(<SurveyManagementPage />);
    
    // Verify that the survey exists in the list
    const survey1Elements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'Survey 1';
    });
    expect(survey1Elements.length).toBeGreaterThan(0);
    
    // Delete the survey
    fireEvent.click(screen.getByText(/❌/i)); // Assuming there's only one delete button
    
    // Verify that the survey is removed from the list
    const removedSurveyElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'Survey 1';
    });
    expect(removedSurveyElements.length).toBe(0);
});
