import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useRouter } from '../Switcher/RouterContext';
import Copyright from './Copyright';
import { useLogin } from './LoginContext';

const SignUp = () =>  {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const { signUp } = useLogin();
    const { setPage } = useRouter();  

    const handleSignUp = async () => {
      if (!username) {
        setErrorMessage("Please enter a username");
        return;
      }

      if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)) {
        setErrorMessage("Your password must contain at least eight characters, one letter and one number");
        return;
      }

      if (password !== passwordConfirm) {
        setErrorMessage("Password and confirmation do not match");
        return;
      }

      setErrorMessage("")
      const response = await signUp(username, password);
      console.log(response)
      if (response.status !== 201) {
        setErrorMessage("Sorry, that username is already taken")
      }
    }

    return (
      <Container component="main" maxWidth="xs">
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
            Sign up
          </Typography>
          {
            !!errorMessage ? 
              <Typography component="h3" variant="h6" color={"error"} textAlign={"center"}>
                {errorMessage}
              </Typography> 
            : null
          }
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
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
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="passwordConfirm"
                    label="Password Confirm"
                    type="password"
                    id="passwordConfirm"
                    autoComplete="current-password"
                    color="secondary"
                    value={passwordConfirm}
                    onChange={({ target: { value } }) => setPasswordConfirm(value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="space-evenly">
              <Grid item>
                <Link onClick={() => setPage('/login')} color="secondary" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
  );
}

export default SignUp;