import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurveyManagementPage from '../app/surveymanagement/page';
import '@testing-library/jest-dom';

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

    // Check for the main title
    const titleElement = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'h1' && content.includes('Survey Management');
    });
    expect(titleElement.length).toBeGreaterThan(0);

    // Check for the "Create Survey" button
    expect(screen.getByText(/Add Survey/i)).toBeInTheDocument();

    // Check for the search input
    expect(screen.getByPlaceholderText(/Search Surveys by title/i)).toBeInTheDocument();
});


// test('submits a new survey and displays it in the list', () => {
//   render(<SurveyManagementPage />);

//   // Open the survey modal
//   fireEvent.click(screen.getByText(/Add Survey/i));

//   // Fill out the survey form
//   fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'New Survey' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter description/i), { target: { value: 'This is a new survey' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter level/i), { target: { value: '1' } });

//   // Submit the form
//   fireEvent.click(screen.getByText(/Submit/i));

//   // Verify that the new survey appears in the list
//   const surveyElements = screen.queryAllByText((content, element) => {
//       return element.tagName.toLowerCase() === 'td' && content === 'New Survey';
//   });
//   expect(surveyElements.length).toBeGreaterThan(0);
// });

// test('deletes a survey from the list', () => {
//   render(<SurveyManagementPage />);

//   // Simulate that there's already a survey in the list (you may need to mock fetch requests here)
//   fireEvent.click(screen.getByText(/Create Survey/i));
//   fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'Survey to Delete' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter description/i), { target: { value: 'This survey will be deleted' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter level/i), { target: { value: 'Advanced' } });
//   fireEvent.click(screen.getByText(/Submit/i));

//   // Simulate deleting the survey
//   fireEvent.click(screen.getAllByText(/❌/i)[0]); // Assuming the delete button has ❌ icon

//   // Verify that the survey is removed from the list
//   const deletedSurveyElement = screen.queryAllByText((content, element) => {
//       return element.tagName.toLowerCase() === 'td' && content === 'Survey to Delete';
//   });
//   expect(deletedSurveyElement.length).toBe(0);
// });
