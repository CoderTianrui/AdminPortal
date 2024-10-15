'use client';

import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Input from '@mui/joy/Input';
import Layout from '../../components/layout';
import Header from '../../components/header';
import Navigation from '../../components/navigation';
import '../NewsNotificationsManagement.css';

interface Subscriptions {
    channel: string;
    subscriber: string;
    action: string;
}

export default function ManageSubscribedChannels() {
    const [subscriptionSearchQuery, setSubscriptionSearchQuery] = React.useState('');

    const [subscriptionList, setSubscriptionList] = React.useState<Subscriptions[]>([
        {
            channel: 'ABC News',
            subscriber: 'Student 1',
            action: 'block'
        },
        {
            channel: 'BBC News',
            subscriber: 'Student 2',
            action: 'block'
        },
    ]);
    const [filteredSubscriptionList, setFilteredSubscriptionList] = React.useState<Subscriptions[]>(subscriptionList);

    const handleSubscriptionSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubscriptionSearchQuery(e.target.value);
        filterSubscriptions(e.target.value);
    };

    const filterSubscriptions = (query: string) => {
        const filtered = subscriptionList.filter(subscription =>
            subscription.channel.toLowerCase().includes(query.toLowerCase()) ||
            subscription.subscriber.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSubscriptionList(filtered);
    };

    const toggleAction = (index: number) => {
        const updatedList = [...filteredSubscriptionList];
        updatedList[index].action = updatedList[index].action === 'block' ? 'unblock' : 'block';
        setFilteredSubscriptionList(updatedList);
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Layout.Root>
                <Navigation />
                <Header />
                <Layout.Main>
                    <Box sx={{ width: '100%', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                        <Button
                            variant="solid"
                            color="primary"
                            component="a"
                            href="/news_notifications/"
                            sx={{
                                backgroundColor: 'grey',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'darkgrey', 
                                },
                            }}
                        >
                            ← back to previous page
                        </Button>
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>Subscribed News Channels Management</h1>
                        <Input
                            placeholder="Search by channel or subscriber..."
                            value={subscriptionSearchQuery}
                            onChange={handleSubscriptionSearchQueryChange}
                            sx={{ width: '300px', marginBottom: '20px' }}
                        />
                        <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Channel Name</th>
                                        <th>Subscribed by</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubscriptionList.map((subscription, index) => (
                                        <tr key={index}>
                                            <td>{subscription.channel}</td>
                                            <td>{subscription.subscriber}</td>
                                            <td>
                                                <Button
                                                    variant="soft"
                                                    color={subscription.action === 'block' ? 'danger' : 'success'}
                                                    size="sm"
                                                    onClick={() => toggleAction(index)}
                                                >
                                                    {subscription.action}
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
