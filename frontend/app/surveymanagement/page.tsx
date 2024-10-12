'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Box from '@mui/joy/Box';
import Select from '@mui/joy/Select'; 
import Option from '@mui/joy/Option'; 
import Chip from '@mui/joy/Chip';     
import Layout from '../components/layout';
import Header from '../components/header';
import Navigation from '../components/navigation';

import './SurveyManagement.css';

interface Surveys {
    title: string;
    description: string;
    level: string;
    school: string[];
}

export default function SurveyManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = React.useState(false);
    const [surveyList, setSurveyList] = React.useState<Surveys[]>([
        {title: 'Survey 1', description: 'This is a description of survey 1', level: '1', school: ['University Of Sydney', 'University of Melbourne']},
        {title: 'Survey 2', description: 'This is a description of survey 2', level: '2', school: ['University Of Sydney', 'University of New South Wales']},
        {title: 'Survey 3', description: 'This is a description of survey 3', level: '3', school: ['University Of Sydney', 'University of Technology Sydney']}
    ]);
    const [newSurvey, setNewSurvey] = React.useState<Surveys>({ title: '', description: '', level: '', school: [] });
    const [editSurveyIndex, setEditSurveyIndex] = React.useState<number | null>(null);
    const [surveySearchQuery, setSurveySearchQuery] = React.useState('');
    const [filteredSurveyList, setFilteredSurveyList] = React.useState<Surveys[]>([]);

    React.useEffect(() => {
        // Initialize the survey list and filtered list on mount
        setFilteredSurveyList(surveyList);
    }, [surveyList]);

    const openSurveyModal = (index: number | null = null) => {
        if (index !== null) {
            setNewSurvey(surveyList[index]);
            setEditSurveyIndex(index);
        }
        setIsSurveyModalOpen(true);
    };

    const closeSurveyModal = () => {
        setIsSurveyModalOpen(false);
        setNewSurvey({ title: '', description: '', level: '', school: [] });
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
        const surveyToSubmit = { ...newSurvey };

        if (editSurveyIndex !== null) {
            // Update existing survey
            const updatedSurveyList = [...surveyList];
            updatedSurveyList[editSurveyIndex] = surveyToSubmit;
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList);
        } else {
            // Add new survey
            const updatedSurveyList = [...surveyList, surveyToSubmit];
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList);
        }
        closeSurveyModal();
    };

    const deleteSurvey = (index: number) => {
        const updatedSurveyList = surveyList.filter((_, i) => i !== index);
        setSurveyList(updatedSurveyList);
        setFilteredSurveyList(updatedSurveyList);
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

                                        <label>Recipients</label>
                                        <Select
                                            multiple
                                            value={newSurvey.school}
                                            onChange={(event, newValue) =>
                                                setNewSurvey({ ...newSurvey, school: newValue })
                                            }
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                    {selected.map((selectedOption) => (
                                                        <Chip variant="soft" color="primary">
                                                            {selectedOption.label}
                                                        </Chip>
                                                    ))}
                                                </Box>
                                            )}
                                            sx={{ minWidth: '15rem' }}
                                        >
                                            <Option value="University of Sydney">University of Sydney</Option>
                                            <Option value="University of Melbourne">University of Melbourne</Option>
                                            <Option value="University of New South Wales">University of New South Wales</Option>
                                            <Option value="University of Technology Sydney">University of Technology Sydney</Option>
                                            <Option value="Monte Sant' Angelo">Monte Sant&apos; Angelo</Option>
                                            <Option value="Willoughby High School">Willoughby High School</Option>
                                        </Select>

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
                                        <th>Recipient Schools</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredSurveyList) && filteredSurveyList.map((survey, index) => (
                                        <tr key={index}>
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.level}</td>
                                            <td>
                                                {survey.school.map((school) => (
                                                    <Chip key={school} variant="soft" color="primary">
                                                        {school}
                                                    </Chip>
                                                ))}
                                            </td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => openSurveyModal(index)}>
                                                    ✏️
                                                </Button>
                                                <Button variant="plain" size="sm" onClick={() => deleteSurvey(index)}>
                                                    ❌
                                                </Button>
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
