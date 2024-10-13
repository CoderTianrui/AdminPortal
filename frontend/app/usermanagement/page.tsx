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
// import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import Link from 'next/Link';


import './UserList.css';


interface School {
    id: string;
    name: string;
  }

interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    profile: string;
    school: School | string | null;
    access: string;
    relatedUsers: string[] | null;
}

export default function UserManagementPage() {

    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [users, setUsers] = React.useState<User[]>([]);
    const [schools, setSchools] = React.useState<School[]>([]);
    const [newUser, setNewUser] = React.useState<User>({
        firstName: '', lastName: '', email: '', profile: '', school: null, access: '', relatedUsers: []
    });
    const [editIndex, setEditIndex] = React.useState<number | null>(null);
    const [search, setSearch] = React.useState('');
    const [selectedProfile, setSelectedProfile] = React.useState<string | ''>('');
    // const router = useRouter();

    // Fetch users on component mount
    React.useEffect(() => {
        const fetchData = async () => {
            // Fetch users first and wait for the state to update
            await fetchSchools();
    
            // Now fetch schools after users are populated
            fetchUsers();
        };
    
        fetchData();
    }, []);  // Empty dependency array to ensure it runs once
    

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
    


    // Fetch users from the back-end
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3333/users');  
            const data = await response.json();
            
            
            setUsers(data.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };



    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    
    const handleSubmit = async () => {
        console.log('consoleSubmit called');
        console.log('newUser:', newUser);
    
        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.profile || !newUser.access) {
            console.error('All fields are required');
            return; 
        }
    
        let response; 
        
        try {
            const { school, relatedUsers, ...restOfNewUser } = newUser; 

        
            const payload = {
                ...restOfNewUser,
                userSchoolId: school && typeof school === 'object'
                    ? school.id
                    : school
                        ? parseInt(school, 10)
                        : null,  
                relatedUsers: relatedUsers && relatedUsers.length > 0 
                    ? relatedUsers.map((id) => Number(id)) 
                    : null 
                
            };

            console.log("users", relatedUsers);
    
            if (editIndex !== null) {
                response = await fetch(`http://localhost:3333/users/${users[editIndex].id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                // Create new user
                console.log('Payload:', payload);
    
                response = await fetch('http://localhost:3333/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
        
                console.log("Response Status: ", response.status);
                console.log("Response Object: ", response);
        
                if (!response.ok) {
                    throw new Error('Failed to save');
                    // const errorMessage = await response.text();  // Get detailed error message
                    // throw new Error(`Failed to create user: ${errorMessage}`);
                }
                
    
                const createdUser = await response.json();
                console.log(createdUser);
                console.log('New User Saved: ', createdUser);
        
                setUsers((prevUsers) => {
                    const updatedUsers = [...prevUsers, createdUser];
                    console.log('Updated Users:', updatedUsers);
                    return updatedUsers;
                  });
            }
            fetchUsers();
            closeUserModal();
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };
    
    // Handle user edit
    const handleEdit = (index: number) => {
        setEditIndex(index);
        setNewUser(users[index]);
        setIsUserModalOpen(true);
    };

    // Handle user delete
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

    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value.toLowerCase());
    };

    
    const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user && user.firstName && user.lastName && 
        `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(search)
    )
    : [];

    const openUserModal = (index: number | null = null) => {
        if (index !== null) {
            setNewUser(users[index]);
            setEditIndex(index);
        }
        setIsUserModalOpen(true);
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setNewUser({ firstName: '', lastName: '', email: '', profile: '', school: null, access: '', relatedUsers: [] });
        setEditIndex(null);
    };

    // const handleNavigate = (userId: number) => {
    //     if (router) {
    //         router.push(`/userprofile/[userId].tsx`);
    //       }
    //   };

    

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
                                                    <option value="">Select a Profile</option>
                                                    <option value="Student">Student</option>
                                                    <option value="Parent">Parent</option>
                                                    <option value="Teacher">Teacher</option>
                                                    <option value="Admin">Admin</option>
                                                </select>
                                                <label>School</label>
                                                <select
                                                    className="form-select"
                                                    aria-label="School"
                                                    name="school"
                                                    value={newUser.school ? (typeof newUser.school === 'object' ? newUser.school.id : newUser.school) : ''}
                                                    onChange={(e) => {
                                                        const selectedSchool = schools.find(school => school.id === e.target.value); // Find selected school by ID
                                                        setNewUser((prevUser) => ({
                                                            ...prevUser,
                                                            school: selectedSchool || e.target.value // Store the full school object for display
                                                        }));
                                                    }}
                                                >
                                                    <option value="">Select a School</option>
                                                    {schools.map((school) => (
                                                        <option key={school.id} value={school.id}>
                                                            {school.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label>Access</label>
                                                <select 
                                                    className="form-select" 
                                                    aria-label="Access" 
                                                    name="access"
                                                    value={newUser.access}
                                                    onChange={handleChange}>
                                                     <option value="">Select an Access</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                    <option value="Full">Full</option>
                                                </select>
                                                <label>Related Users (comma-separated user IDs)</label>
                                                <input
                                                    type="text"
                                                    name="relatedUsers"
                                                    placeholder="e.g., 1, 2, 3"
                                                    value={newUser.relatedUsers ? newUser.relatedUsers.join(', ') : ''}  // Show as a comma-separated string
                                                    onChange={(e) => setNewUser((prevUser) => ({
                                                        ...prevUser,
                                                        relatedUsers: e.target.value.trim() === '' ? null : e.target.value.split(',').map(id => id.trim())  // Convert to array or set null if empty
                                                    }))}
                                                />
                                            </div>
                                            <button className="submit-button" type="button" onClick={handleSubmit}>Submit</button>
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
                                                <td>
                                                <Button href={`/userprofile/${user.id}`} 
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    padding: 0,
                                                    textAlign: 'left', 
                                                    fontWeight: 'normal',
                                                    color: 'inherit',
                                                    cursor: 'pointer'
                                                }}>
                                                {user.firstName} {user.lastName} <br />{user.email}
                                                </Button>
                                                    {/* <Button variant="plain"
                                                    color="neutral"
                                                    component="a"
                                                    sx={{ fontWeight: 400 }} 
                                                    size="lg"
                                                    // href={`/userprofile/${user.id}`} >
                                                    // onClick={() => {
                                                    //     router.push({
                                                    //       pathname: '/userprofile/[uid]',
                                                    //       query: { uid: user.id },
                                                    //     })
                                                    // }}
                                                    >
                                                    {user.firstName} {user.lastName}<br />{user.email}
                                                    </Button> */}
                                                </td>
                                                <td>{user.profile}</td>
                                                <td>
                                                   
                                                    {typeof user.school === 'object' && user.school !== null
                                                        ? user.school.name 
                                                        : user.school}       
                                                </td>
                                                <td>{user.access}</td>
                                                <td>
                                                {Array.isArray(user.relatedUsers) && user.relatedUsers.length > 0
                                                    ? user.relatedUsers
                                                        .map((relatedUser) => {
                                                        // Parse if the relatedUser is a JSON string
                                                        const parsedUser = typeof relatedUser === 'string' ? JSON.parse(relatedUser) : relatedUser;
                                                        return `${parsedUser.firstName} ${parsedUser.lastName}`;
                                                        })
                                                        .join(', ')
                                                    : 'No related users'}
                                                </td>                                              
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