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
    id?: number;
    name: string;
    image: string;
}

interface SOSNotification {
    id?: number;
    profileImage: string;
    name: string;
    email: string;
    alertDate: string;
    school: string;
    contact: string;
}

export default function DailyMoodPage() {
    const [moodList, setMoodList] = React.useState<Mood[]>([]);
    const [newMood, setNewMood] = React.useState<Mood>({ name: '', image: '' });
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editIndex, setEditIndex] = React.useState<number | null>(null);

    const [sosNotifications, setSosNotifications] = React.useState<SOSNotification[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        fetchMoods();
        fetchSOSNotifications();
    }, []);

    const fetchMoods = async () => {
        try {
            const response = await fetch('http://localhost:3333/moods');
            if (!response.ok) {
                throw new Error('Failed to fetch moods');
            }
            const jsonData = await response.json();
            console.log('Fetched Moods:', jsonData); // output log
            setMoodList(jsonData.data);
        } catch (error) {
            console.error('Error fetching moods:', error);
            setMoodList([]);
        }
    };
    

    const fetchSOSNotifications = async () => {
        try {
            const response = await fetch('http://localhost:3333/sos_messages');
            const jsonData = await response.json();
            setSosNotifications(jsonData.data); 
        } catch (error) {
            console.error('Error fetching SOS notifications:', error);
        }
    };

    const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMood({ ...newMood, [e.target.name]: e.target.value });
    };

    const submitMood = async () => {
        console.log('Submitting mood:', newMood);
        if (!newMood.name || !newMood.image) {
            alert('Please fill in both the name and the image URL.');
            return;
        }
    
        try {
            const formattedMood = {
                name: newMood.name,
                imageUrl: newMood.image  
            };
    
            if (editIndex !== null) {
                // edit mood
                const response = await fetch(`http://localhost:3333/moods/${moodList[editIndex].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedMood),
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error while updating mood! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Updated mood:', data);
            } else {
                // add new mood
                const response = await fetch('http://localhost:3333/moods', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedMood),
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error while creating mood! Status: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('Created mood:', data);
            }
    
            fetchMoods();
            setNewMood({ name: '', image: '' }); 
            setIsModalOpen(false); 
            setEditIndex(null); 
        } catch (error) {
            console.error('Error submitting mood:', error);
            alert('Failed to submit mood. Please try again.');
        }
    };
    
    

    const editMood = (index: number) => {
        const moodToEdit = moodList[index];
        setNewMood(moodToEdit); 
        setIsModalOpen(true);  
        setEditIndex(index);     
    };
    
    const deleteMood = async (index: number) => {
        if (window.confirm('Are you sure you want to delete this mood?')) {
            try {
                const moodToDelete = moodList[index];
                await fetch(`http://localhost:3333/moods/${moodToDelete.id}`, {
                    method: 'DELETE',
                });
                fetchMoods(); // re get mood list
            } catch (error) {
                console.error('Error deleting mood:', error);
            }
        }
    };
    

    const deleteNotification = async (index: number) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            try {
                const notificationToDelete = sosNotifications[index];
                await fetch(`http://localhost:3333/sos_messages/${notificationToDelete.id}`, {
                    method: 'DELETE',
                });
                fetchSOSNotifications();
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    };

    const sendNotification = (index: number) => {
        alert(`Notification sent to ${sosNotifications[index].contact}`);
    };

    // const filteredMoods = moodList
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}  //onChange
                                // endDecorator={<Button variant="outlined">Filter</Button>}
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
