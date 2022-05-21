import React from "react"
import ModalPopup from "../Modal/ModalPopup"

const FullScreenImageModal = ({isOpen, setIsOpen, src}) => (
    <ModalPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
    >
        <img
            width={"100%"}
            src={src}
            alt={"Full Screen"}
        />
    </ModalPopup>

)

export default FullScreenImageModal;