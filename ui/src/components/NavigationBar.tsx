import { useContext } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { CurrentUserContext } from '../contexts/UserContext';

function NavigationBar () {
    const { userData } = useContext(CurrentUserContext);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <div className="flex-grow">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        href="./"
                    >
                        <HomeIcon />
                    </IconButton>
                </div>
                <div className="right-0">
                    {userData ?
                        <Button startIcon={<AccountBoxIcon/>} color="inherit" href={`./#/users/${userData.id}`}>{userData.name}</Button>
                    :
                        <Button startIcon={<PersonAddAltIcon/>} color="inherit" href="./#/signup">Sign Up/Login</Button>
                    }
                </div>
                </Toolbar>
            </AppBar>
            </Box>
        </>
    );
}

export default NavigationBar;