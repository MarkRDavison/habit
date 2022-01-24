import React from 'react';
import * as zcc from '@mark.davison/zeno-common-client';
import { RouteComponentProps, withRouter } from 'react-router';
import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';

type Props = RouteComponentProps;

/* istanbul ignore next */
const _NavBar = (props: Props): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const {
        isLoggedIn,
        login,
        logout
    } = zcc.useAuth();

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const navigate = (page: string): void => {
        props.history.push(page);
        handleClose();
    };

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
                        <MenuItem onClick={(): void => navigate('/')}>Home</MenuItem>
                        {isLoggedIn
                            ? <MenuItem onClick={logout}>Logout</MenuItem>
                            : <MenuItem onClick={login}>Login</MenuItem>
                        }
                    </Menu>
                    <Typography variant="h5" style={{ flexGrow: 1 }}>
                        Zeno Habit
                    </Typography>
                    <IconButton style={{ flexGrow: 1 }}>
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}

const NavBar = withRouter(_NavBar);
export default NavBar;