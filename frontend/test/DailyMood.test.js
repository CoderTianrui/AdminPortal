import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DailyMoodPage from '../app/Daily_mood/page';
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

test('renders the DailyMoodPage and checks for basic elements', () => {
    render(<DailyMoodPage />);

    // Check for the main title
    const titleElement = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'h1' && content.includes('Mood Types');
    });
    expect(titleElement.length).toBeGreaterThan(0);

    // Check for the "Add Mood" button
    expect(screen.getByText(/Add Mood/i)).toBeInTheDocument();

    // Check for the "SOS Notifications" section
    const sosTitle = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'h2' && content.includes('SOS Notifications');
    });
    expect(sosTitle.length).toBeGreaterThan(0);
});

test('submits a new mood and displays it in the list', () => {
    render(<DailyMoodPage />);

    // Open the mood modal
    fireEvent.click(screen.getByText(/Add Mood/i));

    // Fill out the mood form
    fireEvent.change(screen.getByLabelText(/Mood Name/i), { target: { value: 'Happy' } });
    fireEvent.change(screen.getByLabelText(/Mood Image URL/i), { target: { value: 'https://via.placeholder.com/50' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit/i));

    // Verify that the new mood appears in the list
    const moodElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'Happy';
    });
    expect(moodElements.length).toBeGreaterThan(0);
});

test('deletes a mood from the list', () => {
    render(<DailyMoodPage />);

    // Delete the mood
    fireEvent.click(screen.getAllByText(/❌/i)[0]); 

    // Verify that the mood is removed from the list
    const deletedMoodElement = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'Excitement';
    });
    expect(deletedMoodElement.length).toBe(0);
});

