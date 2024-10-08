// 'use client';

// import * as React from 'react';
// import { CssVarsProvider } from '@mui/joy/styles';
// import CssBaseline from '@mui/joy/CssBaseline';
// import Button from '@mui/joy/Button';
// import Box from '@mui/joy/Box';
// import Input from '@mui/joy/Input';
// import Layout from '../../components/layout';
// import Header from '../../components/header';
// import Navigation from '../../components/navigation';
// import '../NewsNotificationsManagement.css';

// interface Subscriptions {
//     channel: string;
//     subscriber: string;
//     action: string;
// }

// export default function ManageSubscribedChannels() {
//     const [drawerOpen, setDrawerOpen] = React.useState(false);
//     const [subscriptionSearchQuery, setSubscriptionSearchQuery] = React.useState('');

//     const [subscriptionList, setSubscriptionList] = React.useState<Subscriptions[]>([
//         {
//             channel: 'ABC News',
//             subscriber: 'Student 1',
//             action: 'block'
//         },
//         {
//             channel: 'BBC News',
//             subscriber: 'Student 2',
//             action: 'block'
//         },
//     ]);
//     const [filteredSubscriptionList, setFilteredSubscriptionList] = React.useState<Subscriptions[]>(subscriptionList);

//     const handleSubscriptionSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSubscriptionSearchQuery(e.target.value);
//         filterSubscriptions(e.target.value);
//     };

//     const filterSubscriptions = (query: string) => {
//         const filtered = subscriptionList.filter(subscription =>
//             subscription.channel.toLowerCase().includes(query.toLowerCase()) ||
//             subscription.subscriber.toLowerCase().includes(query.toLowerCase())
//         );
//         setFilteredSubscriptionList(filtered);
//     };

//     const toggleAction = (index: number) => {
//         const updatedList = [...filteredSubscriptionList];
//         updatedList[index].action = updatedList[index].action === 'block' ? 'unblock' : 'block';
//         setFilteredSubscriptionList(updatedList);
//     };

//     return (
//         <CssVarsProvider disableTransitionOnChange>
//             <CssBaseline />
//             {drawerOpen && (
//                 <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
//                     <Navigation />
//                 </Layout.SideDrawer>
//             )}
//             <Layout.Root
//                 sx={{
//                     ...(drawerOpen && {
//                         height: '100vh',
//                         overflow: 'hidden',
//                     }),
//                 }}
//             >
//                 <Layout.Header>
//                     <Header />
//                 </Layout.Header>
//                 <Layout.SideNav>
//                     <Navigation />
//                 </Layout.SideNav>
//                 <Layout.Main>
//                     <Box sx={{ width: '100%', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
//                         <Button
//                             variant="solid"
//                             color="primary"
//                             component="a"
//                             href="/news_notifications/"
//                             sx={{
//                                 backgroundColor: 'grey',
//                                 color: 'white',
//                                 '&:hover': {
//                                     backgroundColor: 'darkgrey', 
//                                 },
//                             }}
//                         >
//                             ← back to previous page
//                         </Button>
//                         <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>Subscribed News Channels Management</h1>
//                         <Input
//                             placeholder="Search by channel or subscriber..."
//                             value={subscriptionSearchQuery}
//                             onChange={handleSubscriptionSearchQueryChange}
//                             sx={{ width: '300px', marginBottom: '20px' }}
//                         />
//                         <Box sx={{ overflowX: 'auto', marginBottom: '40px' }}>
//                             <table className="table">
//                                 <thead>
//                                     <tr>
//                                         <th>Channel Name</th>
//                                         <th>Subscribed by</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredSubscriptionList.map((subscription, index) => (
//                                         <tr key={index}>
//                                             <td>{subscription.channel}</td>
//                                             <td>{subscription.subscriber}</td>
//                                             <td>
//                                                 <Button
//                                                     variant="soft"
//                                                     color={subscription.action === 'block' ? 'danger' : 'success'}
//                                                     size="sm"
//                                                     onClick={() => toggleAction(index)}
//                                                 >
//                                                     {subscription.action}
//                                                 </Button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </Box>
//                     </Box>
//                 </Layout.Main>
//             </Layout.Root>
//         </CssVarsProvider>
//     );
// }

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

interface Subscription {
    channel: string;
    subscriber: string;
    action: string;
    channelId: number;
    userId: number;
}

export default function ManageSubscribedChannels() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [subscriptionSearchQuery, setSubscriptionSearchQuery] = React.useState('');
    const [subscriptionList, setSubscriptionList] = React.useState<Subscription[]>([]);
    const [filteredSubscriptionList, setFilteredSubscriptionList] = React.useState<Subscription[]>([]);

    // Fetch subscriptions from the backend
    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('http://localhost:3333/users');  // 获取用户列表
            const users = await response.json();
            const channelsResponse = await fetch('http://localhost:3333/channels');  // 获取频道列表
            const channels = await channelsResponse.json();

            const subscriptions: Subscription[] = [];

            // 遍历用户列表，检查用户的 permission_metadata 来找到订阅的频道
            users.forEach((user: any) => {
                channels.forEach((channel: any) => {
                    const isBlocked = user.permissionMetadata.includes(channel.id);
                    subscriptions.push({
                        channel: channel.title,
                        subscriber: `${user.firstName} ${user.lastName}`,
                        action: isBlocked ? 'block' : 'unblock',
                        channelId: channel.id,
                        userId: user.id,
                    });
                });
            });

            setSubscriptionList(subscriptions);
            setFilteredSubscriptionList(subscriptions);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    // Fetch subscriptions when the component is mounted
    React.useEffect(() => {
        fetchSubscriptions();
    }, []);

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

    // Toggle the subscription action (block/unblock)
    const toggleAction = async (index: number) => {
        const updatedList = [...filteredSubscriptionList];
        const subscription = updatedList[index];

        try {
            const url = subscription.action === 'block'
                ? `http://localhost:3333/users/${subscription.userId}/channels/${subscription.channelId}/unblock`
                : `http://localhost:3333/users/${subscription.userId}/channels/${subscription.channelId}/block`;

            await fetch(url, { method: 'POST' });

            // 更新按钮状态
            subscription.action = subscription.action === 'block' ? 'unblock' : 'block';
            setFilteredSubscriptionList(updatedList);
        } catch (error) {
            console.error('Error toggling subscription:', error);
        }
    };

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

