import React from 'react';
import * as zcc from '@mark.davison/zeno-common-client';
import { withRouter } from 'react-router';
import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';

interface WithRouterProps {
    history: any
    location: any
    match: any
}

interface OwnProps {

}

type Props = WithRouterProps & OwnProps;

const _NavBar = (props: Props): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const {
      isLoggedIn,
      user,
      login,
      logout
    } = zcc.useAuth();

    const handleClose = () => {
        setAnchorEl(null);
    };
  
    const navigate = (page: string) => {
      props.history.push(page);
      handleClose();
    };

    console.log(isLoggedIn)

    return (
        <div>            
            <AppBar position="static">                
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>                    
                    <Menu
                        id="application-menu"
                        aria-label="application-menu"
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        open={anchorEl !== null}>
                        <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
                        <MenuItem onClick={() => navigate('/private')}>Private</MenuItem>
                        { isLoggedIn 
                            ? <MenuItem onClick={logout}>Logout</MenuItem>
                            : <MenuItem onClick={login}>Login</MenuItem>
                        }
                    </Menu>
                    <Typography variant="h5" style={{flexGrow: 1}}>
                        Zeno Habit
                    </Typography>
                    <Typography variant="h5" style={{flexGrow: 1}}>
                        {(isLoggedIn ? user?.name : null)}
                    </Typography>
                    <IconButton>
                        <AccountCircle />
                    </IconButton>   
                </Toolbar>
            </AppBar>
        </div>
    );
}

const NavBar = withRouter(_NavBar);
export default NavBar;