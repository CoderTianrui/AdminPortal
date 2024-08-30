import * as React from 'react';
import Chip from '@mui/joy/Chip';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';

import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Link from 'next/link';
import { IconButton } from '@/node_modules/@mui/joy/index';

export default function Navigation() {
    return (
        <List
            size="sm"
            sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
        >
            <ListItem nested>
                <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
                    Browse
                </ListSubheader>
                <List
                    aria-labelledby="nav-list-browse"
                    sx={{
                        '& .JoyListItemButton-root': { p: '8px' },
                    }}
                >
                    <ListItem>
                        <ListItemButton component={Link} href='/signin'>
                            <ListItemDecorator>
                                <PeopleRoundedIcon fontSize="small" />
                            </ListItemDecorator>
                            <ListItemContent>Sign in</ListItemContent>
                        </ListItemButton>
                    </ListItem>
                
                    <ListItem>
                        <ListItemButton component={Link} href='/calendar'>
                            <ListItemDecorator>
                                <CalendarMonth fontSize="small" />
                            </ListItemDecorator>
                            <ListItemContent>Calendar</ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    
                </List>
            </ListItem>
        </List>
    );
}
