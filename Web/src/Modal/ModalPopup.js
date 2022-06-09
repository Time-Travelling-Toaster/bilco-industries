import { Dialog } from "@mui/material";
import { Box } from "@mui/system";

const modalSytle = {
    border: "0px solid",
    boxShadow: 24,
    padding: 4,
    outline: 0
}

const ModalPopup = ({isOpen, setIsOpen, children, clearData}) => (
    <Dialog
        open={isOpen}
        onClose={() => {
            if (clearData) clearData();
            setIsOpen(false);
        }}
        style={modalSytle}
    >
        <Box sx={{ padding: 4 }} >
            {children}
        </Box>
    </Dialog>
);

export default ModalPopup;