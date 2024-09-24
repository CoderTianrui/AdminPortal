import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Ensure fireEvent is imported
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

test('displays an event modal', async () => {
  render(<Calendar initialEvents={[]} />);

  // Simulate clicking on the date '15'
  fireEvent.click(screen.getByText('15'));

  expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Memo')).toBeInTheDocument();
  const dateInputs = screen.getAllByDisplayValue('2023-08-15');
  expect(dateInputs.length).toBeGreaterThan(0);
});

test('opens and closes the event modal', () => {
  render(<Calendar initialEvents={[]} />);

  fireEvent.click(screen.getByText('15'));

  fireEvent.click(screen.getByText('×'));

  expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
});

test('displays an event modal', async () => {
  render(<Calendar initialEvents={[]} />);

  // Simulate clicking on a date '15' to add a new event
  fireEvent.click(screen.getByText('15'));

  // Fill out the form with a new event's details
  fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Event 1' } });
  fireEvent.change(screen.getByPlaceholderText('Memo'), { target: { value: '' } });

  // Get all inputs of type "time" and simulate time changes
  const timeInputs = screen.getAllByRole('textbox', { name: '' });
  fireEvent.change(timeInputs[0], { target: { value: '12:30 PM' } });
  fireEvent.change(timeInputs[1], { target: { value: '13:30 PM' } });

  // Submit the form by clicking the 'Add' button
  fireEvent.click(screen.getByText('Add'));
});
