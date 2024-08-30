'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Box from '@mui/joy/Box';
import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './NewsNotificationsManagement.css';

// Define the types for News and Notification
interface News {
    title: string;
    description: string;
    date: string;
    recipient: string;
}

interface Notification {
    title: string;
    description: string;
    date: string;
    recipient: string;
    school: string;
}

export default function NewsNotificationManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);

    // Add a sample row for News and Notification
    const [newsList, setNewsList] = React.useState<News[]>([
        {
            title: 'News 1',
            description: 'This is a description of news 1',
            date: '2024-09-01',
            recipient: 'Parents',
        },
    ]);

    const [notificationList, setNotificationList] = React.useState<Notification[]>([
        {
            title: 'Notification 1',
            description: 'This is a sample notification..',
            date: '2024-09-01',
            recipient: 'Students',
            school: 'University of Sydney',
        },
    ]);

    const [newNews, setNewNews] = React.useState<News>({ title: '', description: '', date: '', recipient: '' });
    const [newNotification, setNewNotification] = React.useState<Notification>({
        title: '',
        description: '',
        date: '',
        recipient: '',
        school: ''
    });

    const [editNewsIndex, setEditNewsIndex] = React.useState<number | null>(null);
    const [editNotificationIndex, setEditNotificationIndex] = React.useState<number | null>(null);

    const openNewsModal = (index: number | null = null) => {
        if (index !== null) {
            setNewNews(newsList[index]);
            setEditNewsIndex(index);
        }
        setIsNewsModalOpen(true);
    };
    const closeNewsModal = () => {
        setIsNewsModalOpen(false);
        setNewNews({ title: '', description: '', date: '', recipient: '' });
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
        setNewNotification({ title: '', description: '', date: '', recipient: '', school: '' });
        setEditNotificationIndex(null);
    };

    const handleNewsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewNews({ ...newNews, [e.target.name]: e.target.value });
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
    };

    const submitNews = () => {
        if (editNewsIndex !== null) {
            // Edit existing news
            const updatedNewsList = [...newsList];
            updatedNewsList[editNewsIndex] = newNews;
            setNewsList(updatedNewsList);
        } else {
            // Add new news
            setNewsList([...newsList, newNews]);
        }
        closeNewsModal();
    };

    const submitNotification = () => {
        if (editNotificationIndex !== null) {
            // Edit existing notification
            const updatedNotificationList = [...notificationList];
            updatedNotificationList[editNotificationIndex] = newNotification;
            setNotificationList(updatedNotificationList);
        } else {
            // Add new notification
            setNotificationList([...notificationList, newNotification]);
        }
        closeNotificationModal();
    };

    const deleteNews = (index: number) => {
        const updatedNewsList = newsList.filter((_, i) => i !== index);
        setNewsList(updatedNewsList);
    };

    const deleteNotification = (index: number) => {
        const updatedNotificationList = notificationList.filter((_, i) => i !== index);
        setNotificationList(updatedNotificationList);
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
                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={() => openNewsModal()}>
                                Create News
                            </Button>
                            <Input
                                placeholder="Search News"
                                endDecorator={<Button variant="outlined">Filter</Button>}
                                sx={{ width: '300px' }}
                            />
                            <Button variant="solid" color="danger" sx={{ ml: 'auto' }}>Manage subscribed news channels</Button>
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
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter description"
                                            name="description"
                                            value={newNews.description}
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
                                        <th>News description</th>
                                        <th>Date created</th>
                                        <th>Recipients</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newsList.map((news, index) => (
                                        <tr key={index}>
                                            <td>{news.title}</td>
                                            <td>{news.description}</td>
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

                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={() => openNotificationModal()}>
                                Create Notification
                            </Button>
                            <Input
                                placeholder="Search Notification"
                                endDecorator={<Button variant="outlined">Filter</Button>}
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
                                            name="description"
                                            value={newNotification.description}
                                            onChange={handleNotificationChange}
                                            style={{border: '1px solid #ccc', borderRadius: '4px'}}
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
                                        <label>What School?</label>
                                        <select
                                            className="form-control"
                                            name="school"
                                            value={newNotification.school}
                                            onChange={handleNotificationChange}
                                        >
                                            <option>University of Sydney</option>
                                            {/* Add more options here as needed */}
                                        </select>
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
                                        <th>Notification description</th>
                                        <th>Date created</th>
                                        <th>Recipients</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notificationList.map((notification, index) => (
                                        <tr key={index}>
                                            <td>{notification.title}</td>
                                            <td>{notification.description}</td>
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
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
