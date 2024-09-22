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

import './UserList.css';

interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    school: string;
    access: string;
    relatedNames: string[];
}

export default function UserManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>([]);
    const [newUser, setNewUser] = React.useState<User>({
        firstName: '', lastName: '', email: '', profile: '', school: '', access: '', relatedNames: []
    });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [search, setSearch] = React.useState('');
    const [selectedProfile, setSelectedProfile] = React.useState<string | ''>('');

    // This useEffect fetches all users when the component is mounted
    React.useEffect(() => {
        fetchUsers();
    }, []);

    // Function to fetch all users from the back-end
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3333/users');  
            const data = await response.json();
            setUsers(data); // Set the users state with the fetched data
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    // Function to handle form changes for creating/editing a user
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Handle submission for creating or updating a user
    const handleSubmit = async () => {
        if (editIndex !== null) {
            // Update existing user
            try {
                await fetch(`http://localhost:3333/users/${users[editIndex].id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                fetchUsers();  
            } catch (error) {
                console.error('Failed to update user:', error);
            }
            setEditIndex(null);
        } else {
            // Create new user
            try {
                await fetch('http://localhost:3333/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                fetchUsers();  
            } catch (error) {
                console.error('Failed to create user:', error);
            }
        }
        closeUserModal();
    };

    // Handle user edit action
    const handleEdit = (index: number) => {
        setEditIndex(index);
        setNewUser(users[index]);
        setIsUserModalOpen(true);
    };

    // Handle user delete action
    const handleDelete = async (index: number) => {
        try {
            await fetch(`http://localhost:3333/users/${users[index].id}`, {
                method: 'DELETE',
            });
            fetchUsers();  
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    // Update the search value and filter users based on the search term
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value.toLowerCase());
    };

    // Filter users based on the search term
    const filteredUsers = users.filter(user =>
        `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(search)
    );

    // Open modal for creating or editing a user
    const openUserModal = (index: number | null = null) => {
        if (index !== null) {
            setNewUser(users[index]);
            setEditIndex(index);
        }
        setIsUserModalOpen(true);
    };

    // Close the user creation/edit modal
    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setNewUser({ firstName: '', lastName: '', email: '', profile: '', school: '', access: '', relatedNames: [] });
        setEditIndex(null);
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            {drawerOpen && (
                <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </Layout.SideDrawer>
            )}
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
                    <article className="table-container">
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>User Management</h1>
                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={() => openUserModal()}>
                                Create User
                            </Button>
                            {/* Modal for Create or Edit Users */}
                            {isUserModalOpen && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <button className="modal-close" onClick={closeUserModal}>✖️</button>
                                        <div className="modal-body">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={newUser.firstName}
                                                onChange={handleChange}
                                            />
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={newUser.lastName}
                                                onChange={handleChange}
                                            />
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                placeholder="Email"
                                                value={newUser.email}
                                                onChange={handleChange}
                                            />
                                            <label>Profile</label>
                                            <select 
                                                className="form-select" 
                                                aria-label="Profile" 
                                                name="profile"
                                                value={newUser.profile}
                                                onChange={handleChange}>
                                                <option value="Student">Student</option>
                                                <option value="Parent">Parent</option>
                                                <option value="Teacher">Teacher</option>
                                            </select>
                                            <label>School</label>
                                            <select 
                                                className="form-select" 
                                                aria-label="School" 
                                                name="school"
                                                value={newUser.school}
                                                onChange={handleChange}>
                                                <option value="University of Sydney">University of Sydney</option>
                                                <option value="University of Melbourne">University of Melbourne</option>
                                                <option value="Monte Sant' Angelo">Monte Sant&apos; Angelo</option>
                                                <option value="Willoughby High School">Willoughby High School</option>
                                            </select>
                                            <label>Access</label>
                                            <select 
                                                className="form-select" 
                                                aria-label="Access" 
                                                name="access"
                                                value={newUser.access}
                                                onChange={handleChange}>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Full">Full</option>
                                            </select>
                                            <label>Related Names (comma-separated)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="relatedNames"
                                                placeholder="e.g., John Doe, Jane Smith"
                                                value={newUser.relatedNames.join(', ')}  
                                                onChange={(e) => {
                                                    setNewUser((prevUser) => ({
                                                        ...prevUser,
                                                        relatedNames: e.target.value.split(',').map(name => name.trim())  
                                                    }));
                                                }}
                                            />
                                        </div>
                                        <button className="submit-button" onClick={handleSubmit}>Submit</button>
                                    </div>
                                </div>
                            )}
                            <div className="mb-3">
                                <Input
                                    placeholder="Search by name"
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
                                    <th scope="col">Profile</th>
                                    <th scope="col">School</th>
                                    <th scope="col">Access</th>
                                    <th scope="col">Relations</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{user.firstName} {user.lastName}<br />{user.email}</td>
                                            <td>{user.profile}</td>
                                            <td>{user.school}</td>
                                            <td>{user.access}</td>
                                            <td>{user.relatedNames.join(', ')}</td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => openUserModal(index)}>✏️</Button>
                                                <Button variant="plain" size="sm" onClick={() => handleDelete(index)}>❌</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </article>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
