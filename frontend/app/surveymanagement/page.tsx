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

// Define the types for News and Notification
interface Surveys {
    title: string;
    description: string;
    level: string;
    recipient: string;
}


export default function SurveyManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = React.useState(false);

    // Add a sample row for News and Notification
    const [surveyList, setSurveyList] = React.useState<Surveys[]>([
        {
            title: 'Survey 1',
            description: 'This is a description of survey 1',
            level: '1',
            recipient: 'school 1, school 2, school 3',
        },

        {
            title: 'Survey 2',
            description: 'This is a description of survey 2',
            level: '2',
            recipient: 'school 4, school 5, school 6',
        },
    ]);


    const [newSurvey, setNewSurvey] = React.useState<Surveys>({ title: '', description: '', level: '', recipient: '' });

    const [editSurveyIndex, setEditSurveyIndex] = React.useState<number | null>(null);

    const [surveySearchQuery, setSurveySearchQuery] = React.useState('');

    const [filteredSurveyList, setFilteredSurveyList] = React.useState<Surveys[]>(surveyList);

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

   

    const submitSurvey = () => {
        if (editSurveyIndex !== null) {
            // Edit existing surveys
            const updatedSurveyList = [...surveyList];
            updatedSurveyList[editSurveyIndex] = newSurvey;
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList)
        } else {
            // Add new surveys
            const updatedSurveyList = [...surveyList, newSurvey];
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList);  // Update the filtered list after adding new survey
        }
        closeSurveyModal();
    };


    const deleteSurvey = (index: number) => {
        const updatedSurveyList = surveyList.filter((_, i) => i !== index);
        setSurveyList(updatedSurveyList);
        setFilteredSurveyList(updatedSurveyList);  // Update the filtered list after deleting news
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
