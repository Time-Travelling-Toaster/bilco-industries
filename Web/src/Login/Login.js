import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useLogin } from './LoginContext';
import { useNavigate } from "react-router-dom";
import Copyright from './Copyright';

const Login = () => {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const { login } = useLogin();
 const navigator = useNavigate();

    const handleLogin = async () => {
        if (!username) {
            setErrorMessage("Please enter your username");
            return;    
        }

        if (!password) {
            setErrorMessage("Please enter your password");
            return;    
        }

        const response = await login(username, password, remember);
        if (response.status === 200) {
            navigator.push('/roadtrip');
        }

        setErrorMessage("Username or password is incorrect")
    };

    return (
        <Container background='secondary' component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                {
                    !!errorMessage ? 
                    <Typography component="h3" variant="h6" color={"error"} textAlign={"center"}>
                        {errorMessage}
                    </Typography> 
                    : null
                }
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="UserName"
                        label="User Name"
                        name="UserName"
                        autoComplete="UserName"
                        autoFocus
                        color="secondary"
                        value={username}
                        onChange={({ target: { value } }) => setUserName(value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        color="secondary"
                        value={password}
                        onChange={({ target: { value } }) => setPassword(value)}
                    />
                    <FormControlLabel
                        control={<Checkbox value={remember} onChange={({target: { checked }}) => setRemember(checked)} color="secondary" />}
                        label="Remember me"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="space-evenly">
                        <Grid item>
                            <Link onClick={() => navigator.push('/signup')} color="secondary" variant="body2">
                                Don't have an account yet? Sign up here
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright  sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}

export default Login;