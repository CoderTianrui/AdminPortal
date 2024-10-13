'use client';


import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
// import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './School.css';

interface User {
    id?: string;
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
    adminUser: User | string | null;
}



export default function SchoolManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isSchoolModalOpen, setIsSchoolModalOpen] = React.useState(false);
    const [schools, setSchools] = React.useState<School[]>([]);
    const [newSchool, setNewSchool] = React.useState<School>({ name: '', adminUser: null });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [search, setSearch] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3333/users');
            const data = await response.json();
            setUsers(data.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };
    
    React.useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch schools on component mount
    React.useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const response = await fetch('http://localhost:3333/schools');
            const data = await response.json();
            setSchools(data.data || []);
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
        setSearch(e.target.value.toLowerCase());
    };

    const filteredSchools = schools.filter(school =>
        school && school.name.toLowerCase().includes(search)
    );

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
    {/* {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
            <Navigation />
        </Layout.SideDrawer>
    )} */}
    <Stack
        id="tab-bar"
        direction="row"
        justifyContent="space-around"
        spacing={1}
        sx={{
            display: { xs: 'flex', sm: 'none' },
            zIndex: '999',
            bottom: 0,
            position: 'fixed',
            width: '100dvw',
            py: 2,
            backgroundColor: 'background.body',
            borderTop: '1px solid',
            borderColor: 'divider',
        }}
    >
        <Button
            variant="plain"
            color="neutral"
            component="a"
            href="/joy-ui/getting-started/templates/email/"
            size="sm"
            sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
            User Management
        </Button>
        <Button
            variant="plain"
            color="neutral"
            aria-pressed="true"
            component="a"
            href="/joy-ui/getting-started/templates/team/"
            size="sm"
            sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
            News Management
        </Button>
        <Button
            variant="plain"
            color="neutral"
            component="a"
            href="/joy-ui/getting-started/templates/files/"
            size="sm"
            sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
            Survey Management
        </Button>
    </Stack>
    {/* <Layout.Root
        sx={{
            ...(drawerOpen && {
                height: '100vh',
                overflow: 'hidden',
            }),
        }}
    > */}
        {/* <Layout.Header>
            <Header />
        </Layout.Header>
        <Layout.SideNav>
            <Navigation />
        </Layout.SideNav>
        <Layout.Main> */}

    
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
                                        adminUser: e.target.value || null, // Set to null if no admin selected
                                    }))}
                                >
                                    <option value="">No Admin User</option> {/* Option to not select an admin */}
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
                                {school.adminUser && typeof school.adminUser === 'object'
                                    ? `${school.adminUser.firstName} ${school.adminUser.lastName}`
                                    : 'No Admin'}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                    <button onClick={() => handleDelete(index)}>Delete</button>
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
        {/* </Layout.Main>
    </Layout.Root> */}
 </CssVarsProvider>
);
}