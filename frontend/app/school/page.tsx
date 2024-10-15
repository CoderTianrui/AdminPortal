'use client';


import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './School.css';
import { School } from '@mui/icons-material';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    school: School | string | null;
    access: string;
    relatedNames: string[];
}

interface School {
    id?: string;
    name: string;
    adminUserId?: string | number;
    adminUser: User | string | null;
}



export default function SchoolManagementPage() {
    const [isSchoolModalOpen, setIsSchoolModalOpen] = React.useState(false);
    const [schools, setSchools] = React.useState<School[]>([]);
    const [newSchool, setNewSchool] = React.useState<School>({ name: '', adminUser: null });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [search, setSearch] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);




    React.useEffect(() => {
        const fetchData = async () => {
            // Fetch users first and wait for the state to update
            await fetchUsers();

            // Now fetch schools after users are populated
            fetchSchools();
        };

        fetchData();
    }, []);  // Empty dependency array to ensure it runs once


    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3333/users');
            const data = await response.json();


            setUsers(data.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };


    const fetchSchools = async () => {
        console.log('fetchSchools called');
        try {
            const response = await fetch('http://localhost:3333/schools');
            const data = await response.json();
            console.log('Fetched Schools Data:', data);

            let fetchedSchools: School[] = [];

            if (Array.isArray(data)) {
                fetchedSchools = data;
            } else if (data.data && Array.isArray(data.data)) {
                fetchedSchools = data.data;
            } else {
                console.error('Unexpected response structure:', data);
            }

            // Check the fetched users and schools data
            console.log("Users here:", users);
            console.log("Schools:", fetchedSchools);

            // // Map schools to include admin user details using adminUserId
            // const schoolsWithAdminDetails = fetchedSchools.map((school: School) => {
            //     // Ensure that adminUserId is defined and not null

            //     const adminUser = users.find(user => {
            //         console.log(`Checking user: ${user.firstName} ${user.lastName}, user.id: ${user.id}, adminUserId: ${school.adminUserId}`);
            //         return String(user.id) === String(school.adminUserId);
            //     });
            //     return {
            //         ...school,
            //         adminUser: adminUser || null,
            //     };
            // });

            // console.log("Schools with admin details:", schoolsWithAdminDetails);

            setSchools(fetchedSchools);
        } catch (error) {
            console.error('Failed to fetch schools:', error);
        }
    };





    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewSchool((prevSchool) => ({
            ...prevSchool,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!newSchool.name) {
            console.error('All fields are required');
            return;
        }

        let response;
        try {
            const payload = {
                name: newSchool.name,
                adminUserId: newSchool.adminUser && typeof newSchool.adminUser === 'object'
                    ? newSchool.adminUser.id
                    : newSchool.adminUser,
            };

            if (editIndex !== null) {
                response = await fetch(`http://localhost:3333/schools/${schools[editIndex].id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch('http://localhost:3333/schools', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Failed to create school: ${errorMessage}`);
                }

                const createdSchool = await response.json();
                setSchools((prevSchools) => [...prevSchools, createdSchool]);
            }

            closeSchoolModal();
        } catch (error) {
            console.error('Failed to save school:', error);
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setNewSchool(schools[index]);
        setIsSchoolModalOpen(true);
    };

    const handleDelete = async (index: number) => {
        try {
            await fetch(`http://localhost:3333/schools/${schools[index].id}`, {
                method: 'DELETE',
            });
            fetchSchools();
        } catch (error) {
            console.error('Failed to delete school:', error);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    React.useEffect(() => {
        console.log('Schools state updated:', schools);
    }, [schools]);

    const filteredSchools = search.trim()
        ? schools.filter(school =>
            school?.name?.toLowerCase().includes(search.trim().toLowerCase())
        )
        : schools;
    console.log('Search term:', search);
    console.log('Filtered schools:', filteredSchools);
    console.log('Schools:', schools);


    const openSchoolModal = (index: number | null = null) => {

        if (index !== null) {
            setNewSchool(schools[index]);
            setEditIndex(index);
        }
        setIsSchoolModalOpen(true);
    };

    const closeSchoolModal = () => {
        setIsSchoolModalOpen(false);
        setNewSchool({ name: '', adminUser: null });
        setEditIndex(null);
    };

    return (<CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Layout.Root>
            <Navigation />
            <Header />
            <Layout.Main>


                <div>
                    <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>School Management</h1>

                    <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                        <Button variant="solid" color="primary" onClick={() => openSchoolModal()}>
                            Create School
                        </Button>

                        {isSchoolModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={closeSchoolModal}>✖️</button>
                                    <div className="modal-body">
                                        <label>School Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="School Name"
                                            value={newSchool.name}
                                            onChange={handleChange}
                                        />

                                        <label>Admin User (optional)</label>
                                        <select
                                            className="form-select"
                                            aria-label="Admin User"
                                            name="adminUser"
                                            value={newSchool.adminUser ? (typeof newSchool.adminUser === 'object' ? newSchool.adminUser.id : newSchool.adminUser) : ''}
                                            onChange={(e) => setNewSchool((prevSchool) => ({
                                                ...prevSchool,
                                                adminUser: e.target.value || null,
                                            }))}
                                        >
                                            <option value="">No Admin User</option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="submit-button" type="button" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <Input
                                placeholder="Search schools"
                                value={search}
                                onChange={handleSearchChange}
                                endDecorator={<Button variant="outlined">Filter</Button>}
                                sx={{ width: '300px' }}
                            />
                        </div>
                    </Box>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Admin</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchools.length > 0 ? (
                                filteredSchools.map((school, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{school.name}</td>
                                        <td>

                                            {typeof school.adminUser === 'object' && school.adminUser !== null && school.adminUser.lastName
                                                ? `${school.adminUser.firstName ? school.adminUser.firstName + ' ' : ''}${school.adminUser.lastName}`
                                                : 'No Admin'}
                                        </td>
                                        <td>
                                            <Button variant="plain" size="sm" onClick={() => openSchoolModal(index)}>✏️</Button>
                                            <Button variant="plain" size="sm" onClick={() => handleDelete(index)}>❌</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>No schools found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Layout.Main>
        </Layout.Root>
    </CssVarsProvider>
    );
}