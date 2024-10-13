import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import NewsNotificationManagementPage from '../app/news_notifications/page';
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
  
test('renders the NewsNotificationManagementPage and checks for basic elements', () => {
    render(<NewsNotificationManagementPage />);
    
    expect(screen.getByText(/News and Notification Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Create News/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Notification/i)).toBeInTheDocument();
});

test('opens and closes the news modal', () => {
    render(<NewsNotificationManagementPage />);

    fireEvent.click(screen.getByText(/Create News/i));
    expect(screen.getByPlaceholderText(/Enter title/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/✖️/i));
    expect(screen.queryByPlaceholderText(/Enter title/i)).not.toBeInTheDocument();
});

// test('adds a new news item', () => {
//     render(<NewsNotificationManagementPage />);

//     fireEvent.click(screen.getByText(/Create News/i));

//     fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'Test News' } });
//     fireEvent.change(screen.getByPlaceholderText(/Enter URL/i), { target: { value: 'http://example.com' } });
//     fireEvent.change(screen.getByPlaceholderText(/Enter recipient/i), { target: { value: 'Students' } });

//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(screen.getByText(/Test News/i)).toBeInTheDocument();
// });

// test('deletes a news item', () => {
//     render(<NewsNotificationManagementPage />);

//     fireEvent.click(screen.getAllByText(/❌/i)[0]);

//     expect(screen.queryByText(/News 1/i)).not.toBeInTheDocument();
// });

// test('filters news based on search input', () => {
//     render(<NewsNotificationManagementPage />);

//     fireEvent.change(screen.getByPlaceholderText(/Search News by title/i), { target: { value: 'News 2' } });

//     const news2Elements = screen.getAllByText(/News 2/i);
//     expect(news2Elements.length).toBeGreaterThan(0);

//     const news1TitleElements = screen.queryAllByText((content, element) => {
//         return (
//           element.tagName.toLowerCase() === 'td' &&
//           content === 'News-1' &&
//           element.closest('tr') !== null 
//         );
//       });
//       expect(news1TitleElements.length).toBe(0);
      
//       const news3TitleElements = screen.queryAllByText((content, element) => {
//         return (
//           element.tagName.toLowerCase() === 'td' &&
//           content === 'News-3' &&
//           element.closest('tr') !== null 
//         );
//       });
//       expect(news3TitleElements.length).toBe(0);});

// test('adds a new notification', () => {
//   render(<NewsNotificationManagementPage />);

//   // Open the notification modal
//   fireEvent.click(screen.getByText(/Create Notification/i));

//   // Fill in the notification form
//   fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'Test Notification' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter content/i), { target: { value: 'This is a test notification content.' } });
//   fireEvent.change(screen.getByPlaceholderText(/Enter recipient/i), { target: { value: 'Students' } });

//   // Submit the form
//   fireEvent.click(screen.getByText(/Submit/i));

//   // Check that the new notification is displayed in the document
//   const notifications = screen.getAllByText(/Test Notification/i);
//   expect(notifications.length).toBeGreaterThan(0); // Check at least one instance is present
//   expect(screen.getByText(/This is a test notification content./i)).toBeInTheDocument();
// });


test('opens and closes the notification modal', () => {
  render(<NewsNotificationManagementPage />);

  fireEvent.click(screen.getByText(/Create Notification/i));
  expect(screen.getByPlaceholderText(/Enter title/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/✖️/i));
  expect(screen.queryByPlaceholderText(/Enter title/i)).not.toBeInTheDocument();
});