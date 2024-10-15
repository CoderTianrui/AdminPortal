'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Box from '@mui/joy/Box';
import Layout from '../components/layout';
import Header from '../components/header';
import Navigation from '../components/navigation';

import './NewsNotificationsManagement.css';

// Define the types for News and Notification
interface News {
    id?: number; // Allow for optional id during creation
    title: string;
    url: string;
    date: string;
    recipients: string;
}

interface Notification {
    id?: number; // Allow for optional id during creation
    title: string;
    content: string;
    date: string;
    recipients: string;
}

export default function NewsNotificationManagementPage() {
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);

    const [newsList, setNewsList] = React.useState<News[]>([]);
    const [notificationList, setNotificationList] = React.useState<Notification[]>([]);

    const [newNews, setNewNews] = React.useState<News>({ title: '', url: '', date: '', recipients: '' });
    const [newNotification, setNewNotification] = React.useState<Notification>({ title: '', content: '', date: '', recipients: '' });

    const [editNewsIndex, setEditNewsIndex] = React.useState<number | null>(null);
    const [editNotificationIndex, setEditNotificationIndex] = React.useState<number | null>(null);

    const [newsSearchQuery, setNewsSearchQuery] = React.useState('');
    const [notificationSearchQuery, setNotificationSearchQuery] = React.useState('');

    const [filteredNewsList, setFilteredNewsList] = React.useState<News[]>(newsList);
    const [filteredNotificationList, setFilteredNotificationList] = React.useState<Notification[]>(notificationList);

    React.useEffect(() => {
        // Fetch the initial news and notification lists when the component mounts
        fetchNews();
        fetchNotifications();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('http://localhost:3333/news');
            const jsonData = await response.json();
            // Extract the data from the JSON structure
            const data: News[] = jsonData.data.map((newsItem: any) => ({
                id: newsItem.id,
                title: newsItem.title,
                url: newsItem.url,
                date: new Date(newsItem.date).toISOString().split('T')[0], // Format date if necessary
                recipients: newsItem.recipients,
            }));
            setNewsList(data);
            setFilteredNewsList(data);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3333/notifications');
            const jsonData = await response.json();
            // Extract the notifications data from the JSON structure
            const notifications: Notification[] = jsonData.data.map((notificationItem: any) => ({
                id: notificationItem.id,
                title: notificationItem.title,
                content: notificationItem.content,
                date: new Date(notificationItem.date).toISOString().split('T')[0], // Format date if necessary
                recipients: notificationItem.recipients,
            }));
            setNotificationList(notifications);
            setFilteredNotificationList(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const openNewsModal = (index: number | null = null) => {
        if (index !== null) {
            setNewNews(newsList[index]);
            setEditNewsIndex(index);
        }
        setIsNewsModalOpen(true);
    };

    const closeNewsModal = () => {
        setIsNewsModalOpen(false);
        setNewNews({ title: '', url: '', date: '', recipients: '' });
        setEditNewsIndex(null);
    };

    const openNotificationModal = (index: number | null = null) => {
        if (index !== null) {
            setNewNotification(notificationList[index]);
            setEditNotificationIndex(index);
        }
        setIsNotificationModalOpen(true);
    };

    const closeNotificationModal = () => {
        setIsNotificationModalOpen(false);
        setNewNotification({ title: '', content: '', date: '', recipients: '' });
        setEditNotificationIndex(null);
    };

    const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewNews({ ...newNews, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
    };

    const handleNewsSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewsSearchQuery(e.target.value);
    };

    const handleNotificationSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationSearchQuery(e.target.value);
    };

    const filterNews = () => {
        const filtered = newsList.filter(news =>
            news.title.toLowerCase().includes(newsSearchQuery.toLowerCase())
        );
        setFilteredNewsList(filtered);
    };

    const filterNotifications = () => {
        const filtered = notificationList.filter(notification =>
            notification.title.toLowerCase().includes(notificationSearchQuery.toLowerCase()) ||
            notification.content.toLowerCase().includes(notificationSearchQuery.toLowerCase())
        );
        setFilteredNotificationList(filtered);
    };

    const submitNews = async () => {
        if (editNewsIndex !== null) {
            // Edit existing news
            try {
                const updatedNews = await fetch(`http://localhost:3333/news/${newsList[editNewsIndex].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newNews),
                });
                const updatedData = await updatedNews.json();
                const updatedNewsList = [...newsList];
                updatedNewsList[editNewsIndex] = updatedData;
                setNewsList(updatedNewsList);
                setFilteredNewsList(updatedNewsList);
            } catch (error) {
                console.error('Error updating news:', error);
            }
        } else {
            // Add new news
            try {
                const response = await fetch('http://localhost:3333/news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newNews),
                });
                const createdNews = await response.json();
                // Refetch the news list to get all news including the newly added one
                fetchNews();  // Call fetchNews to get the latest data from the server
            } catch (error) {
                console.error('Error creating news:', error);
            }
        }
        closeNewsModal();
    };

    const submitNotification = async () => {
        if (editNotificationIndex !== null) {
            // Edit existing notification
            try {
                const updatedNotification = await fetch(`http://localhost:3333/notifications/${notificationList[editNotificationIndex].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newNotification),
                });
                const updatedData = await updatedNotification.json();
                const updatedNotificationList = [...notificationList];
                updatedNotificationList[editNotificationIndex] = updatedData;
                setNotificationList(updatedNotificationList);
                setFilteredNotificationList(updatedNotificationList);
            } catch (error) {
                console.error('Error updating notification:', error);
            }
        } else {
            // Add new notification
            try {
                const response = await fetch('http://localhost:3333/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newNotification),
                });
                const createdNotification = await response.json();
                const updatedNotificationList = [...notificationList, createdNotification];
                setNotificationList(updatedNotificationList);
                setFilteredNotificationList(updatedNotificationList);
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        }
        closeNotificationModal();
    };

    const deleteNews = async (index: number) => {
        try {
            const newsToDelete = newsList[index];
            await fetch(`http://localhost:3333/news/${newsToDelete.id}`, {
                method: 'DELETE',
            });
            const updatedNewsList = newsList.filter((_, i) => i !== index);
            setNewsList(updatedNewsList);
            setFilteredNewsList(updatedNewsList);
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };

    const deleteNotification = async (index: number) => {
        try {
            const notificationToDelete = notificationList[index];
            await fetch(`http://localhost:3333/notifications/${notificationToDelete.id}`, {
                method: 'DELETE',
            });
            const updatedNotificationList = notificationList.filter((_, i) => i !== index);
            setNotificationList(updatedNotificationList);
            setFilteredNotificationList(updatedNotificationList);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Layout.Root>
                <Navigation />
                <Header />
                <Layout.Main>
                    <Box sx={{ width: '100%', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>News and Notification Management</h1>

                        {/* News Section */}
                        <Box className="section-container">
                            <Box sx={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="solid" color="primary" onClick={() => openNewsModal()}>
                                        Create News
                                    </Button>
                                    <Input
                                        placeholder="Search News by title..."
                                        value={newsSearchQuery}
                                        onChange={handleNewsSearchQueryChange}
                                        endDecorator={<Button variant="outlined" onClick={filterNews}>Search</Button>}
                                        sx={{ width: '300px' }}
                                    />
                                </Box>
                                <Button
                                    variant="plain"
                                    color="neutral"
                                    size="sm"
                                    component="a"
                                    href="/news_notifications/subscribed_news_channels/"
                                    sx={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'darkred',
                                        },
                                        alignSelf: 'center',
                                    }}
                                >
                                    Manage Subscribed News Channels
                                </Button>
                            </Box>

                            {/* Modal for Create or Edit News */}
                            {isNewsModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <button className="modal-close" onClick={closeNewsModal}>✖️</button>
                                        <div className="modal-body">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter title"
                                                name="title"
                                                value={newNews.title}
                                                onChange={handleNewsChange}
                                            />
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                value={newNews.date}
                                                onChange={handleNewsChange}
                                            />
                                            <label>Recipient</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter recipient"
                                                name="recipients"
                                                value={newNews.recipients}
                                                onChange={handleNewsChange}
                                            />
                                            <label>URL</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter URL"
                                                name="url"
                                                value={newNews.url}
                                                onChange={handleNewsChange}
                                            />
                                        </div>
                                        <button className="submit-button" onClick={submitNews}>Submit</button>
                                    </div>
                                </div>
                            )}
                            <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>News Title</th>
                                            <th>News URL</th>
                                            <th>Date Created</th>
                                            <th>Recipients</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(filteredNewsList) && filteredNewsList.map((news, index) => (
                                            <tr key={index}>
                                                <td>{news.title}</td>
                                                <td>{news.url}</td>
                                                <td>{news.date}</td>
                                                <td>{news.recipients}</td>
                                                <td>
                                                    <Button variant="plain" size="sm" onClick={() => openNewsModal(index)}>✏️</Button>
                                                    <Button variant="plain" size="sm" onClick={() => deleteNews(index)}>❌</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        </Box>

                        {/* Notification Section */}
                        <Box className="section-container">
                            <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                                <Button variant="solid" color="primary" onClick={() => openNotificationModal()}>
                                    Create Notification
                                </Button>
                                <Input
                                    placeholder="Search Notification by title or content..."
                                    value={notificationSearchQuery}
                                    onChange={handleNotificationSearchQueryChange}
                                    endDecorator={<Button variant="outlined" onClick={filterNotifications}>Search</Button>}
                                    sx={{ width: '300px' }}
                                />
                            </Box>
                            {/* Modal for Create or Edit Notification */}
                            {isNotificationModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <button className="modal-close" onClick={closeNotificationModal}>✖️</button>
                                        <div className="modal-body">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter title"
                                                name="title"
                                                value={newNotification.title}
                                                onChange={handleNotificationChange}
                                            />
                                            <label>Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                value={newNotification.date}
                                                onChange={handleNotificationChange}
                                            />
                                            <label>Content</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter content"
                                                name="content"
                                                value={newNotification.content}
                                                onChange={handleNotificationChange}
                                            />
                                            <label>Recipient</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter recipient"
                                                name="recipients"
                                                value={newNotification.recipients}
                                                onChange={handleNotificationChange}
                                            />
                                        </div>
                                        <button className="submit-button" onClick={submitNotification}>Submit</button>
                                    </div>
                                </div>
                            )}
                            <Box sx={{ overflowX: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Notification Title</th>
                                            <th>Notification Content</th>
                                            <th>Date Created</th>
                                            <th>Recipients</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(filteredNotificationList) && filteredNotificationList.map((notification, index) => (
                                            <tr key={index}>
                                                <td>{notification.title}</td>
                                                <td>{notification.content}</td>
                                                <td>{notification.date}</td>
                                                <td>{notification.recipients}</td>
                                                <td>
                                                    <Button variant="plain" size="sm" onClick={() => openNotificationModal(index)}>✏️</Button>
                                                    <Button variant="plain" size="sm" onClick={() => deleteNotification(index)}>❌</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        </Box>
                    </Box>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
