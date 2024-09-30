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

import './SurveyManagement.css';

// Define the types for Survey
interface Surveys {
    id?: number;
    title: string;
    description: string;
    level: string;
    recipient: string;
}

export default function SurveyManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = React.useState(false);
    const [surveyList, setSurveyList] = React.useState<Surveys[]>([]);
    const [newSurvey, setNewSurvey] = React.useState<Surveys>({ title: '', description: '', level: '', recipient: '' });
    const [editSurveyIndex, setEditSurveyIndex] = React.useState<number | null>(null);
    const [surveySearchQuery, setSurveySearchQuery] = React.useState('');
    const [filteredSurveyList, setFilteredSurveyList] = React.useState<Surveys[]>(surveyList);

    React.useEffect(() => {
        // Fetch the initial survey list when the component mounts
        fetchSurveys();
    }, []);

    const fetchSurveys = async () => {
        try {
            const response = await fetch('http://localhost:3333/surveys/'); 
            const data = await response.json();
            setSurveyList(data);
            setFilteredSurveyList(data);
        } catch (error) {
            console.error('Error fetching surveys:', error);
        }
    };

    const openSurveyModal = (index: number | null = null) => {
        if (index !== null) {
            setNewSurvey(surveyList[index]);
            setEditSurveyIndex(index);
        }
        setIsSurveyModalOpen(true);
    };

    const closeSurveyModal = () => {
        setIsSurveyModalOpen(false);
        setNewSurvey({ title: '', description: '', level: '', recipient: '' });
        setEditSurveyIndex(null);
    };

    const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewSurvey({ ...newSurvey, [e.target.name]: e.target.value });
    };

    const handleSurveySearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSurveySearchQuery(e.target.value);
    };

    const filterSurvey = () => {
        const filtered = surveyList.filter(survey =>
            survey.title.toLowerCase().includes(surveySearchQuery.toLowerCase())
        );
        setFilteredSurveyList(filtered);
    };

    const submitSurvey = async () => {
        if (editSurveyIndex !== null) {
            // Edit existing surveys
            try {
                const updatedSurvey = await fetch(`http://localhost:3333/surveys/${surveyList[editSurveyIndex].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSurvey),
                });
                const updatedData = await updatedSurvey.json();
                const updatedSurveyList = [...surveyList];
                updatedSurveyList[editSurveyIndex] = updatedData;
                setSurveyList(updatedSurveyList);
                setFilteredSurveyList(updatedSurveyList);
            } catch (error) {
                console.error('Error updating survey:', error);
            }
        } else {
            // Add new surveys
            try {
                const response = await fetch('http://localhost:3333/surveys/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSurvey),
                });
                const createdSurvey = await response.json();
                const updatedSurveyList = [...surveyList, createdSurvey];
                setSurveyList(updatedSurveyList);
                setFilteredSurveyList(updatedSurveyList);
            } catch (error) {
                console.error('Error creating survey:', error);
            }
        }
        closeSurveyModal();
    };

    const deleteSurvey = async (index: number) => {
        try {
            const surveyToDelete = surveyList[index];
            await fetch(`http://localhost:3333/surveys/${surveyToDelete.id}`, {
                method: 'DELETE',
            });
            const updatedSurveyList = surveyList.filter((_, i) => i !== index);
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList);
        } catch (error) {
            console.error('Error deleting survey:', error);
        }
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
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>Survey Management</h1>
                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={() => openSurveyModal()}>
                                Create Survey
                            </Button>
                            <Input
                                placeholder="Search Surveys by title"
                                value={surveySearchQuery}
                                onChange={handleSurveySearchQueryChange}
                                endDecorator={<Button variant="outlined" onClick={filterSurvey}>Search</Button>}
                                sx={{ width: '300px' }}
                            />
                            <Button variant="solid" color="danger" sx={{ ml: 'auto' }}>Manage Surveys</Button>
                        </Box>
                        {/* Modal for Create or Edit Surveys */}
                        {isSurveyModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={closeSurveyModal}>✖️</button>
                                    <div className="modal-body">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter title"
                                            name="title"
                                            value={newSurvey.title}
                                            onChange={handleSurveyChange}
                                        />
                                        <label>Level</label>
                                        <input
                                            type="level"
                                            className="form-control"
                                            name="level"
                                            value={newSurvey.level}
                                            onChange={handleSurveyChange}
                                        />
                                        <label>Recipient</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter recipient"
                                            name="recipient"
                                            value={newSurvey.recipient}
                                            onChange={handleSurveyChange}
                                        />
                                        <label>Description</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter description"
                                            name="description"
                                            value={newSurvey.description}
                                            onChange={handleSurveyChange}
                                        />
                                    </div>
                                    <button className="submit-button" onClick={submitSurvey}>Submit</button>
                                </div>
                            </div>
                        )}
                        <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Survey Title</th>
                                        <th>Survey description</th>
                                        <th>Level</th>
                                        <th>Recipients</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSurveyList.map((survey, index) => (
                                        <tr key={index}>
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.level}</td>
                                            <td><Button variant="soft" color="neutral" size="sm">{survey.recipient}</Button></td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => openSurveyModal(index)}>✏️</Button>
                                                <Button variant="plain" size="sm" onClick={() => deleteSurvey(index)}>❌</Button>
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
