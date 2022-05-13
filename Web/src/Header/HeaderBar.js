import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useLogin } from '../Login/LoginContext';
import { Switch } from '@mui/material';
import NavMenu from './NavMenu';

const HeaderBar = ({ isLightTheme, setIsLightTheme }) => {
  const navigate = useNavigate();
  const { user, logout } = useLogin();
    
  return (
    <AppBar position="static" color='primary'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            onClick={() => navigate('')}
          >
            Bilco Industries
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <NavMenu />
          </Box>
          <Switch checked={isLightTheme} onChange={() => {
            document.cookie = `theme=${!isLightTheme ? "light" : "dark"}`;
            setIsLightTheme(!isLightTheme);
          }} color='secondary'/>
          {
            !!user ?
              <>
                <AccountBalanceWalletIcon />
                <Box sx={{ flexGrow: 0 }}>
                  <Typography textAlign="center">Balance: £{Number(user.funds || 0).toFixed(2)}</Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }} 
                    variant="text"
                    color="secondary"
                  >
                    Logout
                  </Button>
                </Box>
              </>
            :
              <Button
                onClick={() => navigate('/login')} 
                variant="text"
                color="secondary"
              >
                Login
              </Button>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default HeaderBar;