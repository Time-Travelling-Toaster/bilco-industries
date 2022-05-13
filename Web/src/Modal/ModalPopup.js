import { Dialog } from "@mui/material";
import { Box } from "@mui/system";

const modalSytle = {
    border: "0px solid",
    boxShadow: 24,
    padding: 4,
    outline: 0
}

const x = {
    padding: 4
}

const ModalPopup = ({isOpen, setIsOpen, children, clearData}) => (
    <Dialog
        open={isOpen}
        onClose={() => {
            console.log(!!clearData)
            if (clearData) clearData();
            setIsOpen(false);
        }}
        style={modalSytle}
    >
        <Box sx={x} >
            {children}
        </Box>
    </Dialog>
);

export default ModalPopup;