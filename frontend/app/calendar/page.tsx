'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';

import Layout from '@/app/components/layout';
import Header from '@/app/components/header';
import Navigation from '@/app/components/navigation';

import Calendar from './Calendar';

export default function CalendarPage() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Sample initial events
    const initialEvents = [
        { title: 'Meeting with Mark', date: '2023-09-15', time: '10:00 AM', description: 'Discuss Q3 targets.' },
        { title: 'Lunch with Jacob', date: '2023-09-16', time: '12:00 PM', description: 'Catch up on project status.' },
        { title: 'Conference Call', date: '2023-09-17', time: '3:00 PM', description: 'Weekly sync with the team.' }
    ];

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
                {/* Example of buttons, you might want to customize them */}
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/calendar"
                    size="sm"
                    sx={{ flexDirection: 'column', '--Button-gap': 0 }}
                >
                    Calendar
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
                <Layout.Main
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                height: '100%',
            }}
        >
            <div style={{ marginLeft: '1000px' }}> {/* 使用外部 div 包裹 */}
                <Calendar initialEvents={initialEvents} />
            </div>
        </Layout.Main>


            </Layout.Root>
        </CssVarsProvider>
    );
}
