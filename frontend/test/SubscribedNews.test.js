import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ManageSubscribedChannels from '../app/news_notifications/subscribed_news_channels/page';

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
  
test('renders initial subscription list', () => {
    render(<ManageSubscribedChannels />);
  
    // Check that both subscriptions are rendered
    // expect(screen.getByText(/ABC News/i)).toBeInTheDocument();
    // expect(screen.getByText(/Student 1/i)).toBeInTheDocument();
    // expect(screen.getByText(/BBC News/i)).toBeInTheDocument();
    // expect(screen.getByText(/Student 2/i)).toBeInTheDocument();
});

test('displays no results for non-matching search input', () => {
  render(<ManageSubscribedChannels />);

  // Simulate searching for a non-existing subscription
  fireEvent.change(screen.getByPlaceholderText(/Search by channel or subscriber/i), { target: { value: 'Non-Existent News' } });

  // Check that no subscription rows are rendered
  const rows = screen.queryAllByRole('row');
  expect(rows.length).toBe(1); // Only the header row should be present
});

test('filters subscriptions based on search input', () => {
    render(<ManageSubscribedChannels />);

    // Simulate searching for "ABC News"
    fireEvent.change(screen.getByPlaceholderText(/Search by channel or subscriber/i), { target: { value: 'ABC News' } });

    // Verify that "ABC News" is in the document
    const abcNewsElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'ABC News';
    });
    expect(abcNewsElements.length).toBeGreaterThan(0);

    // Verify that "BBC News" is not in the document after filtering
    const bbcNewsElements = screen.queryAllByText((content, element) => {
        return element.tagName.toLowerCase() === 'td' && content === 'BBC News';
    });
    expect(bbcNewsElements.length).toBe(0);
});

test('toggles block/unblock action for a subscription', () => {
    render(<ManageSubscribedChannels />);

    // Verify that the initial action for "ABC News" is "block"
    // const abcBlockButton = screen.getAllByText(/block/i)[0];
    expect(abcBlockButton).toBeInTheDocument();

    // Click the "block" button to toggle to "unblock"
    fireEvent.click(abcBlockButton);

    // Verify that the button text changes to "unblock"
    expect(abcBlockButton.textContent).toBe('unblock');

    // Click the "unblock" button to toggle back to "block"
    fireEvent.click(abcBlockButton);

    // Verify that the button text changes back to "block"
    expect(abcBlockButton.textContent).toBe('block');
});
