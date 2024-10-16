import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import IconButton from '@mui/joy/IconButton';
import Sheet from '@mui/joy/Sheet';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { toggleSidebar } from './utils';

export default function Header() {
  return (
    <Sheet
      sx={{
        display: { sm: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100vw',
        height: 'var(--Header-height)',
        zIndex: 9995,
        p: 2,
        gap: 1,
        borderBottom: '1px solid',
        borderColor: 'background.level1',
        boxShadow: 'sm',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Header-height': '52px',
            [theme.breakpoints.up('lg')]: {
              '--Header-height': '0px',
            },
          },
        })}
      />
      <IconButton
        onClick={() => toggleSidebar()}
        variant="outlined"
        color="neutral"
        size="sm"
      >
        <MenuRoundedIcon />
      </IconButton>
    </Sheet>
  );
    const [open, setOpen] = React.useState(false);
    return (
        <Box
            sx={{
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'space-between',
            }}
        >
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
            <IconButton
                size="md"
                variant="outlined"
                color="neutral"
                sx={{
                    display: { xs: 'none', sm: 'inline-flex' },
                    borderRadius: '50%',
                    padding: 0, // Remove any default padding for better control of the image
                }}
            >
                <img
                    src="/logo_oic.png"
                    alt="Language"
                    style={{
                        width: '24px', // Adjust width as needed
                        height: '24px', // Adjust height as needed
                        borderRadius: '50%', // Make it circular if the image should be circular
                    }}
                />
            </IconButton>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/homepage/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    Home
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/usermanagement/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    User Management
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/surveymanagement/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    Survey Management
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/news_notifications/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    News/Notification Management
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/Daily_mood/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >
                    DailyMood
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    component="a"
                    href="/school/"
                    size="sm"
                    sx={{ alignSelf: 'center' }}
                >

                    School Management

                </Button>
            </Stack>
            {/* <Box sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
                <IconButton variant="plain" color="neutral" onClick={() => setOpen(true)}>
                    <MenuRoundedIcon />
                </IconButton>
                <Drawer
                    sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <ModalClose />
                    <DialogTitle>Acme Co.</DialogTitle>
                    <Box sx={{ px: 1 }}>
                        <TeamNav />
                    </Box>
                </Drawer>
            </Box> */}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1.5,
                    alignItems: 'center',
                }}
            >
                {/* <Input
                    size="sm"
                    variant="outlined"
                    placeholder="Search anything…"
                    startDecorator={<SearchRoundedIcon color="primary" />}
                    endDecorator={
                        <IconButton
                            variant="outlined"
                            color="neutral"
                            sx={{ bgcolor: 'background.level1' }}
                        >
                            <Typography level="title-sm" textColor="text.icon">
                                ⌘ K
                            </Typography>
                        </IconButton>
                    }
                    sx={{
                        alignSelf: 'center',
                        display: {
                            xs: 'none',
                            sm: 'flex',
                        },
                    }}
                /> */}
                <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{ display: { xs: 'inline-flex', sm: 'none' }, alignSelf: 'center' }}
                >
                    <SearchRoundedIcon />
                                </IconButton>
                                <Tooltip title="Schools Page" variant="outlined">
                    <IconButton
                        size="sm"
                        variant="plain"
                        color="neutral"
                        component="a"
                        href="/school/"  
                        sx={{ alignSelf: 'center' }}
                    >
                        <BookRoundedIcon />
                    </IconButton>
                </Tooltip>
                <ColorSchemeToggle />
                <Dropdown>
                    <MenuButton
                        variant="plain"
                        size="sm"
                        sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
                    >
                        <Avatar
                            src="https://i.pravatar.cc/40?img=2"
                            srcSet="https://i.pravatar.cc/80?img=2"
                            sx={{ maxWidth: '32px', maxHeight: '32px' }}
                        />
                    </MenuButton>
                    <Menu
                        placement="bottom-end"
                        size="sm"
                        sx={{
                            zIndex: '99999',
                            p: 1,
                            gap: 1,
                            '--ListItem-radius': 'var(--joy-radius-sm)',
                        }}
                    >
                        <MenuItem>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar
                                    src="https://i.pravatar.cc/40?img=2"
                                    srcSet="https://i.pravatar.cc/80?img=2"
                                    sx={{ borderRadius: '50%' }}
                                />
                                <Box sx={{ ml: 1.5 }}>
                                    <Typography level="title-sm" textColor="text.primary">
                                        Rick Sanchez
                                    </Typography>
                                    <Typography level="body-xs" textColor="text.tertiary">
                                        rick@email.com
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                        <ListDivider />
                        <MenuItem>
                            <HelpRoundedIcon />
                            Help
                        </MenuItem>
                        <MenuItem>
                            <SettingsRoundedIcon />
                            Settings
                        </MenuItem>
                        <ListDivider />
                        <MenuItem component="a" href="/blog/first-look-at-joy/">
                            First look at Joy UI
                            <OpenInNewRoundedIcon />
                        </MenuItem>
                        <MenuItem
                            component="a"
                            href="https://github.com/mui/material-ui/tree/master/docs/data/joy/getting-started/templates/email"
                        >
                            Sourcecode
                            <OpenInNewRoundedIcon />
                        </MenuItem>
                        <ListDivider />
                        <MenuItem>
                        <a href="/signin" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <LogoutRoundedIcon />
                            Log out
                        </a>
                    </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>
        </Box>
    );
}