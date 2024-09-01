import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react'; // Ensure fireEvent is imported
import Calendar from '../app/calendar/Calendar.js';
import '@testing-library/jest-dom';

test('renders Calendar Management heading', () => {
  render(<Calendar initialEvents={[]} />);
  const headingElement = screen.getByText(/Calendar Management/i);
  expect(headingElement).toBeInTheDocument();
});

// Use fake timers to ensure consistent behavior
beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2023-08-01'));
});

afterAll(() => {
  jest.useRealTimers();
});

test('switches to the next and previous month successfully', () => {
  render(<Calendar initialEvents={[]} />);
  
  // Initially, the month should be August 2023 (set by the fake timer)
  expect(screen.getByText(/August 2023/i)).toBeInTheDocument();

  // Click to switch to the next month
  fireEvent.click(screen.getByText(/>/i));
  expect(screen.getByText(/September 2023/i)).toBeInTheDocument();

  // Click to switch back to the previous month
  fireEvent.click(screen.getByText(/</i));
  expect(screen.getByText(/August 2023/i)).toBeInTheDocument();
});
