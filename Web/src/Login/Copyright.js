import React from "react";
import { Link, Typography } from "@mui/material";

const Copyright = (props) => 
    <Typography  variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
            Bilco Industries
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>

export default Copyright;