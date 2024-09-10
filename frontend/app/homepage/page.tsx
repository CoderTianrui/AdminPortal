'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import './homepage.css';


export default function HomePage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
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
                    Email
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
                    Team
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
                    Files
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
                    <div className="imageContainer">
                        <img src="/Name2_OIC.png" alt="OIC Education Logo" className="image-logo" />
                    </div>
                    <div className="button-container">
                            <Button className="button-item" variant="outlined" component="a" href="/usermanagement/" sx={{
                            color: 'white',        // Text color
                            backgroundColor: 'rgb(0,33,71)',  // Button background color
                            borderColor: '#1976d2',  // Outline color
                            '&:hover': {
                            backgroundColor: '#1565c0',  // Background on hover
                            borderColor: '#1565c0',
                            },
                        }}>User Management</Button>
                        <Button className="button-item" variant="outlined" component="a" href="/surveymanagement/" sx={{
                            color: 'white',        // Text color
                            backgroundColor: 'rgb(0,33,71)',  // Button background color
                            borderColor: '#1976d2',  // Outline color
                            '&:hover': {
                            backgroundColor: '#1565c0',  // Background on hover
                            borderColor: '#1565c0',
                            },
                        }}>Survey Management</Button>
                        <Button className="button-item" variant="outlined" component="a" href="/Daily_mood/" sx={{
                            color: 'white',        // Text color
                            backgroundColor: 'rgb(0,33,71)',  // Button background color
                            borderColor: '#1976d2',  // Outline color
                            '&:hover': {
                            backgroundColor: '#1565c0',  // Background on hover
                            borderColor: '#1565c0',
                            },
                        }}>Daily Moods</Button>
                        <Button className="button-item" variant="outlined" component="a" href="/news_notifications/" sx={{
                            color: 'white',        // Text color
                            backgroundColor: 'rgb(0,33,71)',  // Button background color
                            borderColor: '#1976d2',  // Outline color
                            '&:hover': {
                            backgroundColor: '#1565c0',  // Background on hover
                            borderColor: '#1565c0',
                            },
                        }}>News and Notification</Button>
                    </div>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}