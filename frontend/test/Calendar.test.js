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

// test('adds a new event to the calendar', () => {
//   render(<Calendar initialEvents={[]} />);

//   // Simulate clicking on a date to open the form
//   fireEvent.click(screen.getByText('15'));

//   // Fill in the event form fields
//   fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Event' } });

//   // 填写时间字段
//   fireEvent.change(screen.getAllByRole('textbox')[1], { target: { value: '14:00' } }); // 开始时间
//   fireEvent.change(screen.getAllByRole('textbox')[3], { target: { value: '15:00' } }); // 结束时间

//   // Click the "Add" button to save the event
//   fireEvent.click(screen.getByText('Add'));

//   // Check if the new event is displayed on the calendar
//   expect(screen.getByText('New Event')).toBeInTheDocument();
//   expect(screen.getByText('14:00 - 15:00')).toBeInTheDocument();
// });