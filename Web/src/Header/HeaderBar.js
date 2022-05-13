import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useLogin } from '../Login/LoginContext';
import { Menu, MenuItem, Switch } from '@mui/material';
import NavMenu from './NavMenu';
import MobileNavMenu from './MobileNavMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderBar = ({ isLightTheme, setIsLightTheme }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useLogin();
  const [accountMenuAnchor, setAccountMenuAnchor] = useState();
    
  return (
    <AppBar position="static" color='primary'>
      <Container maxWidth="x1">
        <Toolbar disableGutters={true} >
          <Box sx={{ flexGrow: 1, display: {md: "none", xs: "flex"} }}>
            <MobileNavMenu />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2 , display: 'flex' }}
            onClick={() => navigate('/')}
          >
            Bilco Industries
          </Typography>
          <Box sx={{ flexGrow: 1, display: {md: "block", xs: "none"} }}>
            <NavMenu />
          </Box>
          <AccountCircleIcon 
            color='secondary'
            onClick={({ currentTarget }) => setAccountMenuAnchor(currentTarget)}
          />
          <Menu
            anchorEl={accountMenuAnchor}
            open={!!accountMenuAnchor}
            onClose={() => setAccountMenuAnchor(null)}
          >
            { user?.username && 
              <MenuItem
                // disabled
              >
                <Typography variant="h6" sx={{ textTransform: "capitalize" }} > 
                  Hello, { user?.username }
                </Typography>
              </MenuItem>
            }
            { isAuthenticated && 
              <MenuItem>            
                <AccountBalanceWalletIcon color="secondary" />
                <Typography pl={10}>
                  £{(user.balance || 0).toFixed(2)}
                </Typography>
              </MenuItem>
            }
            <MenuItem
              onClick={() => {
                document.cookie = `theme=${!isLightTheme ? "light" : "dark"}`;
                setIsLightTheme(!isLightTheme);
              }}
            >
              <Typography
                color="secondary"
              >
                Light Theme:
              </Typography>
              <Switch 
                checked={isLightTheme} 
                color='secondary'
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (isAuthenticated) logout();
                navigate('/login')
              }}
            >              
              <Button
                variant="contained"
                fullWidth
                color="secondary"
              >
                { isAuthenticated? "Sign Out" : "Sign In" }
              </Button>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default HeaderBar;