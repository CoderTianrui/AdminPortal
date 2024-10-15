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

interface School {
    id: string;
    name: string;
}

interface Survey {
    id: string;
    title: string;
    description: string;
    level: string;
    // school: School | string | null;
    school: School[];
}

export default function SurveyManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = React.useState(false);
    const [surveyList, setSurveyList] = React.useState<Survey[]>([
        // {title: 'Survey 1', description: 'This is a description of survey 1', level: '1', school: ['University Of Sydney', 'University of Melbourne']},
        // {title: 'Survey 2', description: 'This is a description of survey 2', level: '2', school: ['University Of Sydney', 'University of New South Wales']},
        // {title: 'Survey 3', description: 'This is a description of survey 3', level: '3', school: ['University Of Sydney', 'University of Technology Sydney']}
    ]);
    const [schools, setSchools] = React.useState<School[]>([]);
    const [newSurvey, setNewSurvey] = React.useState<Survey>({ id: '', title: '', description: '', level: '', school: [] });
    const [editSurveyIndex, setEditSurveyIndex] = React.useState<number | null>(null);
    const [surveySearchQuery, setSurveySearchQuery] = React.useState('');
    const [filteredSurveyList, setFilteredSurveyList] = React.useState<Survey[]>([]);

    React.useEffect(() => {
        // Initialize the survey list and filtered list on mount
        setFilteredSurveyList(surveyList);
    }, [surveyList]);

    React.useEffect(() => {
        const fetchData = async () => {

            await fetchSchools();
    
            fetchSurveys();
        };
    
        fetchData();
    }, []);  // Empty dependency array to ensure it runs once

    const fetchSurveys = async ()  => {
        try {
            const res = await fetch('http://localhost:3333/surveys')
            const surveys = await res.json()
            setSurveyList(surveys.data)
        } catch (err) {
            console.log('ERROR HERE: ', err)
        }
    }

    const fetchSchools = async () => {
        console.log('fetchSchools called');
        try {
            const response = await fetch('http://localhost:3333/schools');
            const data = await response.json();
            console.log('Fetched Data:', data);
    
            if (Array.isArray(data)) {
                setSchools(data);  
            } else if (data.data && Array.isArray(data.data)) {
                setSchools(data.data); 
            } else {
                console.error('Unexpected response structure:', data);
            }
        } catch (error) {
            console.error('Failed to fetch schools:', error);
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
        setNewSurvey({ id:'', title: '', description: '', level: '', school: [] });
        setEditSurveyIndex(null);
    };

    const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSurvey((prevSurvey) => ({
            ...prevSurvey,
            [name]: value,
        }));
    };


    // const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    //     setNewSurvey({ ...newSurvey, [e.target.name]: e.target.value });
    // };

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

    const deleteSurvey = async (id: string) => {
        try {
            await fetch(`http://localhost:3333/surveys/${id}`, {
                method: 'DELETE'
            })
            const updatedSurveyList = surveyList.filter((survey, i) => survey.id !== id);
            setSurveyList(updatedSurveyList);
            setFilteredSurveyList(updatedSurveyList);
        } catch (err) {
            console.log('ERROR DELETING SURVEY: ', err)
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

                                        <label>School</label>
                                        <Select
                                        multiple
                                        // value={newSurvey.school.map((school) => school.id)} // Map selected school IDs
                                        // onChange={(event, newValue) => {
                                        //     // Find the selected schools based on the IDs from `newValue`
                                        //     const selectedSchools = newValue
                                        //     .map((schoolId) => schools.find((school) => school.id === schoolId))
                                        //     .filter((school) => school !== undefined); // Filter out any undefined values

                                        //     // Update the state with selected schools
                                        //     setNewSurvey((prevSurvey) => ({
                                        //     ...prevSurvey,
                                        //     school: selectedSchools as School[], // Cast to School[]
                                        //     }));
                                        // }}
                                        value={newSurvey.school.length > 0 ? newSurvey.school.map((school) => school.id) : []} // Handle no selected schools (empty array)
                                        onChange={(event, newValue) => {
                                            // If no schools are selected, `newValue` will be an empty array
                                            const selectedSchools = newValue.length > 0
                                            ? newValue
                                                .map((schoolId) => schools.find((school) => school.id === schoolId))
                                                .filter((school) => school !== undefined) // Filter out any undefined values
                                            : []; // Set to an empty array if no schools are selected

                                            // Update the state with selected schools (or an empty array if none selected)
                                            setNewSurvey((prevSurvey) => ({
                                            ...prevSurvey,
                                            school: selectedSchools as School[] // Store the array of selected schools, or empty
                                            }));
                                        }}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                            {selected.map((option, i) => {
                                                const schoolId = option.value;
                                                const school = schools.find((s) => s.id === schoolId);
                                                return (
                                                <Chip key={i} variant="soft" color="primary">
                                                    {school?.name}
                                                </Chip>
                                                );
                                            })}
                                            </Box>
                                        )}
                                        sx={{ minWidth: '15rem' }}
                                        >
                                        {/* Render the school options */}
                                        {schools.map((school) => (
                                            <Option key={school.id} value={school.id}>
                                            {school.name}
                                            </Option>
                                        ))}
                                        </Select>

                                        {/* Display selected schools below */}
                                        <Box sx={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                                        {newSurvey.school.map((selectedSchool, i) => (
                                            <Chip key={i} variant="soft" color="primary">
                                            {selectedSchool.name}
                                            </Chip>
                                        ))}
                                        </Box>

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
                                        <tr key={survey.id}>
                                            <td>{survey.title}</td>
                                            <td>{survey.description}</td>
                                            <td>{survey.level}</td>
                                            <td>
                                                {Array.isArray(survey.school) && survey.school.length > 0
                                                    ? survey.school.map((s, i) => (
                                                        <span key={i}>
                                                        {s?.name}{i < survey.school.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))
                                                    // : survey.school && typeof survey.school === 'object'
                                                    // ? survey.school.name
                                                    : 'No School'
                                                }
                                                
                                                {/* {survey.school?.map((school) => (
                                                    <Chip key={school} variant="soft" color="primary">
                                                        {school}
                                                    </Chip> */}
                                                
                                            </td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => openSurveyModal(index)}>
                                                    ✏️
                                                </Button>
                                                <Button variant="plain" size="sm" onClick={() => deleteSurvey(survey.id)}>
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
