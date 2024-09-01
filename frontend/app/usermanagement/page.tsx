'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import MenuItem from '@mui/material/MenuItem';
import Select,{ SelectChangeEvent } from '@mui/joy/Select';
import Option from '@mui/joy/Option'
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Slider from '@mui/joy/Slider';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/joy/AccordionDetails';
import AccordionSummary, {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './UserList.css';

interface User {
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    access: string;
}

export default function UserManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>([
        { firstName: 'Mark', lastName: 'Smith', email: 'mark.smith@example.com', profile: 'Parent', access: 'Medium' },
        { firstName: 'Jacob', lastName: 'Johnson', email: 'jacob.johnson@example.com', profile: 'Student', access: 'Full' },
        { firstName: 'Larry', lastName: 'Williams', email: 'larry.williams@example.com', profile: 'Teacher', access: 'High' }
    ]);

    const [newUser, setNewUser] = React.useState<User>({ firstName: '', lastName: '', email: '', profile: '', access: '' });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [search, setSearch] = React.useState('');
    const [selectedProfile, setSelectedProfile] = React.useState<string | ''>('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
    ) => {
        if (e && e.target) {
            const target = e.target as HTMLInputElement | HTMLSelectElement;
            if (target) {
                const { name, value } = target;
                setNewUser((prevUser) => ({
                    ...prevUser,
                    [name]: value,
                }));
            }
        } else {
            console.error("Event object is null or undefined");
        }
    };

    const handleSubmit = () => {
        if (editIndex !== null) {
            const updatedUsers = [...users];
            updatedUsers[editIndex] = newUser;
            setUsers(updatedUsers);
            setEditIndex(null);
        } else {
            const updatedUsersList = [...users, newUser];
            setUsers(updatedUsersList);
        }
        closeUserModal();
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setNewUser(users[index]);
        setIsUserModalOpen(true);
    };

    const handleDelete = (index: number) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value.toLowerCase());
    };
    

    

    const filteredUsers = users.filter(user =>
        `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(search)
    );

    const openUserModal = (index: number | null = null) => {
        if (index !== null) {
            setNewUser(users[index]);
            setEditIndex(index);
        }
        setIsUserModalOpen(true);
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setNewUser({ firstName: '', lastName: '', email: '', profile: '', access: '' });
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
                                    <th scope="col">Access</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {/* <img src={user.profileImage} alt="Profile" className="profile-image" /> */}
                                                {user.firstName} {user.lastName}
                                                <br />
                                                {user.email}</td>
                                            <td>{user.profile}</td>
                                            <td>{user.access}</td>
                                            <td>
                                                <Button variant="plain" size="sm" onClick={() => openUserModal(index)}>✏️</Button>
                                                <Button variant="plain" size="sm" onClick={() => handleDelete(index)}>❌</Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center">No users found</td>
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