import { Button, ButtonGroup } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';
import "../Error.css"

const Error = () =>
    <div className="buttonContainer">
        <ErrorIcon />
        <h1>Something went wrong</h1>
        <h3>We're very sorry</h3>
        <h3>Please select a game from from the menu bar</h3>
    </div>

export default Error;