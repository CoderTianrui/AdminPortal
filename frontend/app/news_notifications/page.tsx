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
    title: string;
    url: string;
    date: string;
    recipient: string;
}

interface Notification {
    title: string;
    content: string;
    date: string;
    recipient: string;
}

export default function NewsNotificationManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);

    // Sample data for News and Notification
    const [newsList, setNewsList] = React.useState<News[]>([
        {
            title: 'News 1',
            url: 'url of the news 1',
            date: '2024-09-01',
            recipient: 'Parents',
        },
        {
            title: 'News 2',
            url: 'url of the news 2',
            date: '2024-09-20',
            recipient: 'Schools',
        },
        {
            title: 'News 3',
            url: 'url of the news 3',
            date: '2024-09-25',
            recipient: 'Parents',
        }
    ]);

    const [notificationList, setNotificationList] = React.useState<Notification[]>([
        {
            title: 'Notification 1',
            content: 'This is the content of notification 1',
            date: '2024-09-01',
            recipient: 'Students',
        },
        {
            title: 'Notification 2',
            content: 'This is the content of notification 2',
            date: '2024-09-02',
            recipient: 'Parents',
        }
    ]);

    const [newNews, setNewNews] = React.useState<News>({ title: '', url: '', date: '', recipient: '' });
    const [newNotification, setNewNotification] = React.useState<Notification>({
        title: '',
        content: '',
        date: '',
        recipient: ''
    });

    const [editNewsIndex, setEditNewsIndex] = React.useState<number | null>(null);
    const [editNotificationIndex, setEditNotificationIndex] = React.useState<number | null>(null);

    const [newsSearchQuery, setNewsSearchQuery] = React.useState('');
    const [notificationSearchQuery, setNotificationSearchQuery] = React.useState('');

    const [filteredNewsList, setFilteredNewsList] = React.useState<News[]>(newsList);
    const [filteredNotificationList, setFilteredNotificationList] = React.useState<Notification[]>(notificationList);

    const openNewsModal = (index: number | null = null) => {
        if (index !== null) {
            setNewNews(newsList[index]);
            setEditNewsIndex(index);
        }
        setIsNewsModalOpen(true);
    };
    const closeNewsModal = () => {
        setIsNewsModalOpen(false);
        setNewNews({ title: '', url: '', date: '', recipient: '' });
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
        setNewNotification({ title: '', content: '', date: '', recipient: '' });
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

    const submitNews = () => {
        if (editNewsIndex !== null) {
            // Edit existing news
            const updatedNewsList = [...newsList];
            updatedNewsList[editNewsIndex] = newNews; // Update the specific news item
            setNewsList(updatedNewsList);
            setFilteredNewsList(updatedNewsList);  // Update the filtered list to reflect changes
        } else {
            // Add new news
            const updatedNewsList = [...newsList, newNews];
            setNewsList(updatedNewsList);
            setFilteredNewsList(updatedNewsList);  // Update the filtered list after adding new news
        }
        closeNewsModal();
    };
    
    const submitNotification = () => {
        if (editNotificationIndex !== null) {
            // Edit existing notification
            const updatedNotificationList = [...notificationList];
            updatedNotificationList[editNotificationIndex] = newNotification; // Update the specific notification item
            setNotificationList(updatedNotificationList);
            setFilteredNotificationList(updatedNotificationList);  // Update the filtered list to reflect changes
        } else {
            // Add new notification
            const updatedNotificationList = [...notificationList, newNotification];
            setNotificationList(updatedNotificationList);
            setFilteredNotificationList(updatedNotificationList);  // Update the filtered list after adding new notification
        }
        closeNotificationModal();
    };
    

    const deleteNews = (index: number) => {
        const updatedNewsList = newsList.filter((_, i) => i !== index);
        setNewsList(updatedNewsList);
        setFilteredNewsList(updatedNewsList);  // Update the filtered list after deleting news
    };

    const deleteNotification = (index: number) => {
        const updatedNotificationList = notificationList.filter((_, i) => i !== index);
        setNotificationList(updatedNotificationList);
        setFilteredNotificationList(updatedNotificationList);  // Update the filtered list after deleting notification
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            {drawerOpen && (
                <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </Layout.SideDrawer>
            )}
            <Layout.Root
                sx={{
                    ...(drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    }),
                }}
            >
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>
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
                                                name="recipient"
                                                value={newNews.recipient}
                                                onChange={handleNewsChange}
                                            />
                                            <label>URL</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Enter url"
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
                                            <th>Date created</th>
                                            <th>Recipients</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredNewsList.map((news, index) => (
                                            <tr key={index}>
                                                <td>{news.title}</td>
                                                <td>{news.url}</td>
                                                <td>{news.date}</td>
                                                <td><Button variant="soft" color="neutral" size="sm">{news.recipient}</Button></td>
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
                                                name="content" // Changed from 'description' to 'content'
                                                value={newNotification.content}
                                                onChange={handleNotificationChange}
                                                style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                                            />
                                            <label>Recipient</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter recipient"
                                                name="recipient"
                                                value={newNotification.recipient}
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
                                            <th>Date created</th>
                                            <th>Recipients</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredNotificationList.map((notification, index) => (
                                            <tr key={index}>
                                                <td>{notification.title}</td>
                                                <td>{notification.content}</td>
                                                <td>{notification.date}</td>
                                                <td><Button variant="soft" color="neutral" size="sm">{notification.recipient}</Button></td>
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
