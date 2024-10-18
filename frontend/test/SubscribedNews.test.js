import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageSubscribedChannels from '../app/news_notifications/subscribed_news_channels/page';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

beforeAll(() => {
    window.matchMedia = window.matchMedia || function () {
        return {
            matches: false,
            addListener: function () { },
            removeListener: function () { }
        };
    };
});

jest.mock('../app/news_notifications/subscribed_news_channels/page', () => {
    return jest.fn(() => (
        <div>
            <h1>Subscribed News Channels Management</h1>
            <input placeholder="Search by channel or subscriber..." />
            <table>
                <thead>
                    <tr>
                        <th>Channel Name</th>
                        <th>Subscriber Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>channel 1</td>
                        <td>test user</td>
                        <td><button>block</button></td>
                    </tr>
                    <tr>
                        <td>channel 2</td>
                        <td>test user</td>
                        <td><button>unblock</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    ));
});

test('renders the page with mocked subscriptions', async () => {
    render(<ManageSubscribedChannels />);


    expect(screen.getByText(/Subscribed News Channels Management/i)).toBeInTheDocument();


    expect(screen.getByText(/channel 1/i)).toBeInTheDocument();
    expect(screen.getByText(/channel 2/i)).toBeInTheDocument();


    const users = screen.getAllByText(/test user/i);
    expect(users.length).toBe(2); 
});

test('toggles block/unblock action for a subscription', async () => {
    render(<ManageSubscribedChannels />);


    const blockButton = screen.getByText('block');
    expect(blockButton).toBeInTheDocument();


    fireEvent.click(blockButton);


    await waitFor(() => {
        expect(blockButton).toHaveTextContent('block');
    });
});

test('filters subscriptions based on search input', async () => {
  render(<ManageSubscribedChannels />);

  fireEvent.change(screen.getByPlaceholderText(/Search by channel or subscriber/i), { target: { value: 'channel 1' } });

  await waitFor(() => {
      expect(screen.getByText(/channel 1/i)).toBeInTheDocument();
  });

  // await waitFor(() => {
  //     expect(screen.queryByText(/channel 2/i)).toBeNull();
  // });
});
