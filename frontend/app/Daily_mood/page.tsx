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
import './DailyMood.css';

interface Mood {
    name: string;
    image: string;
}

interface SOSNotification {
    profileImage: string;
    name: string;
    email: string;
    alertDate: string;
    school: string;
    contact: string;
}

export default function DailyMoodPage() {
    const [moodList, setMoodList] = React.useState<Mood[]>([
        {
            name: 'Excitement',
            image: 'https://via.placeholder.com/50',
        },
    ]);

    const [newMood, setNewMood] = React.useState<Mood>({ name: '', image: '' });
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editIndex, setEditIndex] = React.useState<number | null>(null);

    const [sosNotifications, setSosNotifications] = React.useState<SOSNotification[]>([
        {
            profileImage: 'https://via.placeholder.com/50',
            name: 'Mia Cuvello',
            email: 'mia@sydney.com',
            alertDate: '14/02/2024',
            school: 'University of Sydney',
            contact: 'craig45@sydney.com',
        },
    ]);

    const [searchTerm, setSearchTerm] = React.useState('');

    const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMood({ ...newMood, [e.target.name]: e.target.value });
    };

    const submitMood = () => {
        if (!newMood.name || !newMood.image) {
            alert('Please fill in both the name and the image URL.');
            return;
        }

        if (editIndex !== null) {
            const updatedMoodList = moodList.map((mood, i) =>
                i === editIndex ? newMood : mood
            );
            setMoodList(updatedMoodList);
        } else {
            setMoodList([...moodList, newMood]);
        }

        setNewMood({ name: '', image: '' });
        setIsModalOpen(false);
        setEditIndex(null);
    };

    const editMood = (index: number) => {
        const moodToEdit = moodList[index];
        setNewMood(moodToEdit);
        setIsModalOpen(true);
        setEditIndex(index);
    };

    const deleteMood = (index: number) => {
        if (window.confirm('Are you sure you want to delete this mood?')) {
            const updatedMoodList = moodList.filter((_, i) => i !== index);
            setMoodList(updatedMoodList);
        }
    };

    const deleteNotification = (index: number) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            const updatedNotifications = sosNotifications.filter((_, i) => i !== index);
            setSosNotifications(updatedNotifications);
        }
    };

    const sendNotification = (index: number) => {
        alert(`Notification sent to ${sosNotifications[index].contact}`);
    };

    const filteredMoods = moodList.filter((mood) =>
        mood.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Layout.Root>
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.SideNav>
                    <Navigation />
                </Layout.SideNav>
                <Layout.Main>
                    <Box sx={{ width: '100%', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>Mood Types</h1>
                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={() => setIsModalOpen(true)}>
                                Add Mood
                            </Button>
                            <Input
                                placeholder="Search Moods"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                endDecorator={<Button variant="outlined">Filter</Button>}
                                sx={{ width: '300px' }}
                            />
                        </Box>

                        <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Mood Name</th>
                                        <th>Mood Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMoods.map((mood, index) => (
                                        <tr key={index}>
                                            <td>{mood.name}</td>
                                            <td>
                                                <img src={mood.image || 'https://via.placeholder.com/50'} alt="Mood" style={{ width: '50px', height: '50px' }} />
                                            </td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => editMood(index)}>✏️</Button>
                                                <Button variant="plain" size="sm" onClick={() => deleteMood(index)}>❌</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>

                        {/* SOS Notifications Section */}
                        <h2 className="sos-title">SOS Notifications</h2>
                        <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Alert Date</th>
                                        <th>School</th>
                                        <th>Contact</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sosNotifications.map((notification, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img src={notification.profileImage || 'https://via.placeholder.com/50'} alt="Profile" className="profile-image" />
                                                {notification.name}
                                                <br />
                                                {notification.email}
                                            </td>
                                            <td>{notification.alertDate}</td>
                                            <td>{notification.school}</td>
                                            <td>{notification.contact}</td>
                                            <td>
                                                <Button variant="solid" size="sm" color="primary" onClick={() => sendNotification(index)}>
                                                    Send
                                                </Button>
                                                <Button variant="plain" size="sm">✏️</Button>
                                                <Button variant="plain" size="sm" onClick={() => deleteNotification(index)}>❌</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Box>

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="modal-close" onClick={() => setIsModalOpen(false)}>✖️</button>
                                <div className="modal-body">
                                    <label htmlFor="moodName">Mood Name</label>
                                    <input
                                        id="moodName"
                                        type="text"
                                        name="name"
                                        value={newMood.name}
                                        onChange={handleMoodChange}
                                    />

                                    <label htmlFor="moodImage">Mood Image URL</label>
                                    <input
                                        id="moodImage"
                                        type="text"
                                        name="image"
                                        value={newMood.image}
                                        onChange={handleMoodChange}
                                    />

                                    <button className="submit-button" onClick={submitMood}>Submit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
