import React, { act } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import DailyMoodPage from '../app/Daily_mood/page'; // 请确保导入路径正确
import '@testing-library/jest-dom';

// 模拟 fetch 函数
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: [] })  // 模拟返回空数据
    })
  );

  // 模拟 window.matchMedia
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { }
    };
  };
});

test('renders the DailyMoodPage and checks for basic elements', () => {
  render(<DailyMoodPage />);

  // 检查页面标题
  expect(screen.getByText(/Mood Types/i)).toBeInTheDocument();
  expect(screen.getByText(/SOS Notifications/i)).toBeInTheDocument();

  // 检查页面按钮
  expect(screen.getByText(/Add Mood/i)).toBeInTheDocument();
  expect(screen.getByText(/Add SOS Notification/i)).toBeInTheDocument();
});

test('opens and closes the Add Mood modal', () => {
  render(<DailyMoodPage />);

  // 模拟点击“Add Mood”按钮，打开模态框
  fireEvent.click(screen.getByText(/Add Mood/i));
  expect(screen.getByLabelText(/Mood Name/i)).toBeInTheDocument();

  // 模拟点击关闭按钮，关闭模态框
  fireEvent.click(screen.getByText(/✖️/i));
  expect(screen.queryByPlaceholderText(/Enter mood/i)).not.toBeInTheDocument();
});

test('adds a new mood entry', async () => {
  render(<DailyMoodPage />);

  // 打开 "Add Mood" 模态框
  fireEvent.click(screen.getByText(/Add Mood/i));

  // 填写表单
  fireEvent.change(screen.getByLabelText(/Mood Name/i), { target: { value: 'Happy' } });
  fireEvent.change(screen.getByLabelText(/Mood Image URL/i), { target: { value: 'https://example.com/happy.png' } });

  // 提交表单
  fireEvent.click(screen.getByText(/Submit/i));

  // 确保调用了 fetch 方法，检查网络请求是否成功
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:3333/moods',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Happy', imageUrl: 'https://example.com/happy.png' }),
    })
  );
});

test('filters moods based on search input', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
    { id: 2, name: 'Sad', image: 'https://example.com/sad.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });

  render(<DailyMoodPage />);

  const searchInput = screen.getByPlaceholderText('Search Moods');
  fireEvent.change(searchInput, { target: { value: 'Happy' } });

  await waitFor(() => {
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.queryByText('Sad')).not.toBeInTheDocument();
  });
});

test('deletes a mood', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });

  // 渲染页面
  await act(() => {
    render(<DailyMoodPage />);
  });

  // 获取第一个删除按钮
  const deleteButton = screen.getByTestId('mood-delete'); // 假设删除按钮的 `data-testid` 为 `mood-delete-1`

  // 模拟删除确认弹窗
  window.confirm = jest.fn(() => true);

  // 点击删除按钮
  fireEvent.click(deleteButton);

  // 确保 fetch 调用了 DELETE 方法
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:3333/moods/1',
    expect.objectContaining({
      method: 'DELETE',
    })
  );

  // 检查删除后数据是否更新
  await waitFor(() => {
    expect(screen.queryByText('Happy')).not.toBeInTheDocument();
  });
});

//
// 以下为 SOS Notifications 测试部分，逻辑与 Mood 类似
//

test('opens and closes the Add SOS Notification modal', () => {
  render(<DailyMoodPage />);

  // 模拟点击“Add SOS Notification”按钮，打开模态框
  fireEvent.click(screen.getByText(/Add SOS Notification/i));
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();

  // 模拟点击关闭按钮，关闭模态框
  fireEvent.click(screen.getByText(/✖️/i));
  expect(screen.queryByPlaceholderText(/Enter name/i)).not.toBeInTheDocument();
});

test('adds a new SOS notification entry', async () => {
  render(<DailyMoodPage />);

  // 打开 "Add SOS Notification" 模态框
  fireEvent.click(screen.getByText(/Add SOS Notification/i));

  // 填写表单
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Emily' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'emily@example.com' } });
  fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: '1234567890' } });

  // 提交表单
  fireEvent.click(screen.getByText(/Submit SOS Notification/i));

  // 确保调用了 fetch 方法，检查网络请求是否成功
  waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3333/sos_messages',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Emily',
          email: 'emily@example.com',
          contact: '1234567890',
          alertDate: expect.any(String), // 自动生成的日期
          school: '',
          batch: '',
        }),
      })
    );
  })
});

test('filters SOS notifications based on search input', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
    { id: 2, name: 'Sad', image: 'https://example.com/sad.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });

  const mockSOSNotifications = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123456', batch: 'Batch-1' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', contact: '654321', batch: 'Batch-2' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockSOSNotifications }),
  });

  render(<DailyMoodPage />);

  const searchInput = screen.getByPlaceholderText('Search SOS Notifications (name or batch)');
  fireEvent.change(searchInput, { target: { value: 'John' } });

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});

test('deletes an SOS notification', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
    { id: 2, name: 'Sad', image: 'https://example.com/sad.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });

  const mockSOSNotifications = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123456', batch: 'Batch-1' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockSOSNotifications }),
  });

  await act(() => {
    render(<DailyMoodPage />);
  })

  const deleteButton = screen.getByTestId('sos-delete')

  // 模拟删除确认弹窗
  window.confirm = jest.fn(() => true);

  fireEvent.click(deleteButton);

  // 确保 fetch 调用了 DELETE 方法
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:3333/sos_messages/1',
    expect.objectContaining({
      method: 'DELETE',
    })
  );

  // 检查删除后数据是否更新
  await waitFor(() => {
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});

test('updates an existing mood entry', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });

  await act(async () => {
    render(<DailyMoodPage />);
  });

  // 模拟点击编辑按钮 (假设编辑按钮有特定的 test id 'mood-edit-1')
  const editButton = screen.getByTestId('mood-edit'); // 更新 mood 的第一个按钮
  fireEvent.click(editButton);

  // 检查是否打开了模态框，并且表单中包含原始数据
  expect(screen.getByLabelText(/Mood Name/i)).toHaveValue('Happy');
  expect(screen.getByLabelText(/Mood Image URL/i)).toHaveValue('https://example.com/happy.png');

  // 修改数据
  fireEvent.change(screen.getByLabelText(/Mood Name/i), { target: { value: 'Excited' } });
  fireEvent.change(screen.getByLabelText(/Mood Image URL/i), { target: { value: 'https://example.com/excited.png' } });

  // 提交更新
  fireEvent.click(screen.getByText(/Submit/i));

  // 确保 fetch 调用了 PUT 方法
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:3333/moods/1', // 更新 id 为 1 的 mood
    expect.objectContaining({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Excited', imageUrl: 'https://example.com/excited.png' }),
    })
  );
});

test('updates an existing SOS notification entry', async () => {
  const mockMoods = [
    { id: 1, name: 'Happy', image: 'https://example.com/happy.png' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockMoods }),
  });
  const mockSOSNotifications = [
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123456', batch: 'Batch-1', school: 'ABC School', alertDate: '2024-10-01' },
  ];

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: mockSOSNotifications }),
  });

  await act(async () => {
    render(<DailyMoodPage />);
  });

  // 模拟点击编辑按钮 (假设编辑按钮有特定的 test id 'sos-edit-1')
  const editButton = screen.getByTestId('sos-edit'); // 更新 SOS notification 的第一个按钮
  fireEvent.click(editButton);

  // 检查是否打开了模态框，并且表单中包含原始数据
  expect(screen.getByLabelText(/Name/i)).toHaveValue('John Doe');
  expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
  expect(screen.getByLabelText(/Contact/i)).toHaveValue('123456');
  expect(screen.getByLabelText(/Batch/i)).toHaveValue('Batch-1');
  expect(screen.getByLabelText(/School/i)).toHaveValue('ABC School');

  // 修改数据
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText(/Contact/i), { target: { value: '654321' } });

  // 提交更新
  fireEvent.click(screen.getByText(/Submit SOS Notification/i));

  await waitFor(() => {
    // 确保 fetch 调用了 PUT 方法
    expect(global.fetch).toHaveBeenCalled();
  });
});
