
import React from "react";
import { useConfig } from "../../../Config/ConfigContext";

const SlotMachine = () => {
    const { wheel: wheelConfig } = useConfig();
    return <>
        {Object.keys(wheelConfig).map((item) => <img width={50} height={50} src={require(`../../Images/Wheel/${item}.png`)} />)}
    </> 
}

export default SlotMachine;