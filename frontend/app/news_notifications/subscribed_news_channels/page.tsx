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
    id: number;
    user_id: number;
    channel_id: number;
    action: string; // 'block' or 'unblock'
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    channelActionMetadata: string[]; // 用户权限元数据，保存频道的订阅状态
}

interface Channel {
    id: number;
    title: string;
}



export default function ManageSubscribedChannels() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [subscriptionSearchQuery, setSubscriptionSearchQuery] = React.useState('');
    const [subscriptionList, setSubscriptionList] = React.useState<Subscription[]>([]);
    const [filteredSubscriptionList, setFilteredSubscriptionList] = React.useState<Subscription[]>([]);
    
    
    const [userCache, setUserCache] = React.useState<{ [key: number]: User | null }>({}); // 缓存用户数据
    const [channelCache, setChannelCache] = React.useState<{ [key: number]: Channel | null }>({});


    React.useEffect(() => {
        // Fetch subscription list from backend API
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('http://localhost:3333/subscriptions');
            const result = await response.json();
            const data = result.data;


            // alert(JSON.stringify(data));
            // console.log(data);

    
            // const subscriptions: Subscription[] = data.map((item: any) => ({
            //     id: item.id,
            //     user_id: item.userId,
            //     channel_id: item.channelId,
            //     action: item.action , // 'block' or 'unblock' based on user's permission_metadata
            // }));
            const subscriptions: Subscription[] = await Promise.all(
                data.map(async (item: any) => {
                    const user = await fetchUserById(item.userId);
                    return {
                        id: item.id,
                        user_id: item.userId,
                        channel_id: item.channelId,
                        action: determineAction(item.channelId, user) // 根据 permissionMetadata 决定 block/unblock
                    };
                })
            );

            await Promise.all(subscriptions.map(async (subscription) => {
                if (!channelCache[subscription.channel_id]) {
                    const channel = await fetchChannelById(subscription.channel_id);
                    setChannelCache((prev) => ({ ...prev, [subscription.channel_id]: channel }));
                }

                if (!userCache[subscription.user_id]) {
                    const user = await fetchUserById(subscription.user_id);
                    setUserCache((prev) => ({ ...prev, [subscription.user_id]: user }));
                }
            }));

            // const subscriptions: Subscription[] = await Promise.all(
            //     data.map(async (item: any) => {
            //         const user = await fetchUserById(item.userId); // 根据 user_id 获取用户信息
            //         alert(JSON.stringify(user));
            //         console.log('Fetched user:', user);
            //         const action = determineAction(item.channelId, user); // 根据 permissionMetadata 确定 block/unblock

            //         return {
            //             id: item.id,
            //             user_id: item.userId,
            //             channel_id: item.channelId,
            //             action: action, // 'block' or 'unblock' based on user's permission_metadata
            //         };
            //     })
            // );

            // alert(JSON.stringify(subscriptions));
            // console.log(subscriptions);

    
            setSubscriptionList(subscriptions);
            setFilteredSubscriptionList(subscriptions);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };
    // const fetchUserById = async (userId: number): Promise<User | null> => {
    //     if (userCache[userId]) {
    //         return userCache[userId]; // 如果缓存中已有用户信息，直接返回
    //     }

    //     try {
    //         const response = await fetch(`http://localhost:3333/users/${userId}`);
    //         const user = await response.json();
    //         setUserCache((prevCache) => ({ ...prevCache, [userId]: user })); // 将用户信息存入缓存
    //         return user;
    //     } catch (error) {
    //         console.error(`Error fetching user with ID ${userId}:`, error);
    //         return null;
    //     }
    // };

    const fetchUserById = async (userId: number): Promise<User | null> => {
        if (userCache[userId]) {
            return userCache[userId]; // 缓存中已有
        }
        try {
            const response = await fetch(`http://localhost:3333/users/${userId}`, {
                credentials: 'include',
            });
            const user = await response.json();
            return user;
        } catch (error) {
            console.error(`Error fetching user with ID ${userId}:`, error);
            return null;
        }
    };
    const fetchChannelById = async (channelId: number): Promise<Channel | null> => {
        if (channelCache[channelId]) {
            return channelCache[channelId]; // 缓存中已有
        }
        try {
            const response = await fetch(`http://localhost:3333/channels/${channelId}`);
            const channel = await response.json();
            return channel;
        } catch (error) {
            console.error(`Error fetching channel with ID ${channelId}:`, error);
            return null;
        }
    };
    const determineAction = (channelId: number, user: User | null) => {
        if (user && user.channelActionMetadata[channelId] === 'block') {
            return 'block';
        } else {
            return 'unblock';
        }
    };

    const toggleAction = async (index: number) => {
        const updatedList = [...filteredSubscriptionList];
        const subscription = updatedList[index];
    
        // 获取用户信息
        const user = await fetchUserById(subscription.user_id);
        if (!user) return;
    
        // 判断当前状态并切换
        if (subscription.action === 'block') {
            // 如果当前是 block，则从 channelActionMetadata 中移除 channel_id
            delete user.channelActionMetadata[subscription.channel_id];
            subscription.action = 'unblock';
        } else {
            // 如果当前是 unblock，则将 channel_id 添加到 channelActionMetadata 中并设置为 block
            user.channelActionMetadata[subscription.channel_id] = 'block';
            subscription.action = 'block';
        }
    
        // 更新后端的 channelActionMetadata
        try {
            await fetch(`http://localhost:3333/users/${subscription.user_id}/channel-action`, {
                credentials: 'include',
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelId: subscription.channel_id, action: subscription.action }),
            });
    
            // 同步更新 UI 状态
            setFilteredSubscriptionList(updatedList);
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };
    

    const handleSubscriptionSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubscriptionSearchQuery(e.target.value);
        filterSubscriptions(e.target.value);
    };

    const filterSubscriptions = (query: string) => {
        const filtered = subscriptionList.filter(subscription =>
            subscription.channel_id.toString().includes(query) ||
            subscription.user_id.toString().includes(query)
        );
        setFilteredSubscriptionList(filtered);
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
                        <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>
                            Subscribed News Channels Management
                        </h1>
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
                                        <th>Subscriber Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubscriptionList.map((subscription, index) => {
                                        const channel = channelCache[subscription.channel_id];
                                        const user = userCache[subscription.user_id];
                                        return (
                                            <tr key={index}>
                                                <td>{channel ? channel.title : 'Loading...'}</td>
                                                <td>{user ? `${user.firstName||''} ${user.lastName||''}` : 'Loading...'}</td>
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Layout.Main>
            </Layout.Root>
        </CssVarsProvider>
    );
}


