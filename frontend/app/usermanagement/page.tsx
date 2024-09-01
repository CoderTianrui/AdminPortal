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
    name: string;
    profile: string;
    access: string;
}

export default function UserManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>([
        { name: 'Mark', profile: 'Parent', access: 'Medium' },
        { name: 'Jacob', profile: 'Student', access: 'Full' },
        { name: 'Larry', profile: 'Teacher', access: 'High' }
    ]);

    const [newUser, setNewUser] = React.useState<User>({ name: '', profile: '', access: '' });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [showForm, setShowForm] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (editIndex !== null) {
           
            const updatedUsers = [...users];
            updatedUsers[editIndex] = newUser;
            setUsers(updatedUsers);
            setEditIndex(null);
        } else {
            
            const updatedNewsList = [...users, newUser];
            setUsers(updatedNewsList);
            setEditIndex(null);
        }
        closeUserModal();
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setNewUser(users[index]);
        setShowForm(true);
    };

    const handleDelete = (index : number) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value.toLowerCase()); // Update search state
    };


    const [editUserIndex, setEditUserIndex] = React.useState<number | null>(null);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search)
    );

    const openUserModal = (index: number | null = null) => {
        if (index !== null) {
            setNewUser(users[index]);
            setEditUserIndex(index);
        }
        setIsUserModalOpen(true);
    };
    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setNewUser({ name: '', profile: '', access: '' });
        setEditUserIndex(null);
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
                    startDecorator={<EmailRoundedIcon />}
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
                    startDecorator={<PeopleAltRoundedIcon />}
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
                    startDecorator={<FolderRoundedIcon />}
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
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Name"
                                            value={newUser.name}
                                            onChange={handleChange}
                                        />
                                        <label>Profile</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Student"
                                            name="profile"
                                            value={newUser.profile}
                                            onChange={handleChange}
                                        />
                                        <label>Access</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Low"
                                            name="access"
                                            value={newUser.access}
                                            onChange={handleChange}
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
                                    <th scope="col">Access</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{user.name}</td>
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
