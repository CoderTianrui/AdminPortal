'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Box from '@mui/joy/Box';
import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './NewsNotificationsManagement.css';

export default function NewsNotificationManagementPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = React.useState(false);

    const openNewsModal = () => setIsNewsModalOpen(true);
    const closeNewsModal = () => setIsNewsModalOpen(false);

    const openNotificationModal = () => setIsNotificationModalOpen(true);
    const closeNotificationModal = () => setIsNotificationModalOpen(false);

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
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>News and Notification Management</h1>
                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={openNewsModal}>
                                Create News
                            </Button>
                            <Input
                                placeholder="Search News"
                                endDecorator={<Button variant="outlined">Filter</Button>}
                                sx={{ width: '300px' }}
                            />
                            <Button variant="solid" color="danger" sx={{ ml: 'auto' }}>Manage subscribed news channels</Button>
                        </Box>
                        {/* Modal for Create News */}
                        {isNewsModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={closeNewsModal}>✖️</button>
                                    <div className="modal-body">
                                        <label>Title</label>
                                        <input type="text" className="form-control" placeholder="Enter title" />
                                        <label>Date</label>
                                        <input type="date" className="form-control" />
                                        <label>Recipient</label>
                                        <input type="text" className="form-control" placeholder="Enter recipient" />
                                        <label>News URL</label>
                                        <div className="file-upload">
                                            <p>Drag & Drop or browse</p>
                                        </div>
                                    </div>
                                    <button className="submit-button" onClick={closeNewsModal}>Submit</button>
                                </div>
                            </div>
                        )}
                        <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>News Title</th>
                                        <th>News description</th>
                                        <th>Date created</th>
                                        <th>Recipients</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>News 1</td>
                                        <td>This is a description of News 1 ....</td>
                                        <td>08/03/2024</td>
                                        <td><Button variant="soft" color="neutral" size="sm">Student</Button></td>
                                        <td>
                                            <Button variant="plain" size="sm">✏️</Button>
                                            <Button variant="plain" size="sm">❌</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>

                        <Box sx={{ marginBottom: '20px', display: 'flex', gap: 1 }}>
                            <Button variant="solid" color="primary" onClick={openNotificationModal}>
                                Create Notification
                            </Button>
                            <Input
                                placeholder="Search Notification"
                                endDecorator={<Button variant="outlined">Filter</Button>}
                                sx={{ width: '300px' }}
                            />
                        </Box>
                        {/* Modal for Create Notification */}
                        {isNotificationModalOpen && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <button className="modal-close" onClick={closeNotificationModal}>✖️</button>
                                    <div className="modal-body">
                                        <label>Title</label>
                                        <input type="text" className="form-control" placeholder="Enter title" />
                                        <label>Date</label>
                                        <input type="date" className="form-control" />
                                        <label>Content</label>
                                        <textarea className="form-control" placeholder="type here..." style={{border: '1px solid #ccc', borderRadius: '4px'}}></textarea>
                                        <label>Recipient</label>
                                        <input type="text" className="form-control" placeholder="Enter recipient" />
                                        <label>What School?</label>
                                        <select className="form-control">
                                            <option>University of Sydney</option>
                                            {/* Add more options here as needed */}
                                        </select>
                                    </div>
                                    <button className="submit-button" onClick={closeNotificationModal}>Submit</button>
                                </div>
                            </div>
                        )}
                        <Box sx={{ overflowX: 'auto'}}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Notification Title</th>
                                        <th>Notification description</th>
                                        <th>Date created</th>
                                        <th>Recipients</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Notification 1</td>
                                        <td>This is a description of Notification 1....</td>
                                        <td>10/03/2024</td>
                                        <td><Button variant="soft" color="neutral" size="sm">Parent</Button></td>
                                        <td>
                                            <Button variant="plain" size="sm">✏️</Button>
                                            <Button variant="plain" size="sm">❌</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}
