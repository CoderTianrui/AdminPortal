import React from 'react'; // 恢复 React 的导入
import { render, screen, fireEvent,within } from '@testing-library/react';
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
    
    // 检查页面标题是否存在
    expect(screen.getByText(/News and Notification Management/i)).toBeInTheDocument();
    
    // 检查 "Create News" 和 "Create Notification" 按钮是否存在
    expect(screen.getByText(/Create News/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Notification/i)).toBeInTheDocument();
});


test('opens and closes the news modal', () => {
    render(<NewsNotificationManagementPage />);

    // 打开新闻模态框
    fireEvent.click(screen.getByText(/Create News/i));
    expect(screen.getByPlaceholderText(/Enter title/i)).toBeInTheDocument();

    // 关闭新闻模态框
    fireEvent.click(screen.getByText(/✖️/i));
    expect(screen.queryByPlaceholderText(/Enter title/i)).not.toBeInTheDocument();
});

test('adds a new news item', () => {
    render(<NewsNotificationManagementPage />);

    // 打开新闻模态框
    fireEvent.click(screen.getByText(/Create News/i));

    // 填写表单
    fireEvent.change(screen.getByPlaceholderText(/Enter title/i), { target: { value: 'Test News' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter url/i), { target: { value: 'http://example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter recipient/i), { target: { value: 'Everyone' } });

    // 提交表单
    fireEvent.click(screen.getByText(/Submit/i));

    // 检查新新闻是否被添加到列表中
    expect(screen.getByText(/Test News/i)).toBeInTheDocument();
});

test('deletes a news item', () => {
    render(<NewsNotificationManagementPage />);

    // 删除第一个新闻项目
    fireEvent.click(screen.getAllByText(/❌/i)[0]);

    // 检查新闻是否已被删除
    expect(screen.queryByText(/News 1/i)).not.toBeInTheDocument();
});

test('filters news based on search input', () => {
    render(<NewsNotificationManagementPage />);

    // 搜索 "News 2"
    fireEvent.change(screen.getByPlaceholderText(/Search News by title/i), { target: { value: 'News 2' } });

    const news2Elements = screen.getAllByText(/News 2/i);
    expect(news2Elements.length).toBeGreaterThan(0);

    const news1TitleElements = screen.queryAllByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'td' &&
          content === 'News-1' &&
          element.closest('tr') !== null 
        );
      });
      expect(news1TitleElements.length).toBe(0);
      
      const news3TitleElements = screen.queryAllByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'td' &&
          content === 'News-3' &&
          element.closest('tr') !== null 
        );
      });
      expect(news3TitleElements.length).toBe(0);});