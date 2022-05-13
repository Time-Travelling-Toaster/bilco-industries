import { useRouter } from "./RouterContext";
import SlotMachine from '../Casino/Games/Pages/SlotMachine';
import Blackjack from "../Casino/Games/Pages/Blackjack";
import Sweepstake from "../Sweepstake/Sweepstake";
import RoadtripPlanner from "../RoadtripPlanner/RoadtripPlanner";
import Login from "../Login/Login";
import SignUp from "../Login/SignUp";

const Switch = () => {
    const { page } = useRouter();

    switch(page) {
        case "/casino/slot-machine":
            return <SlotMachine />;
        case "/casino/black-jack":
            return <Blackjack />
        case "/sweepstake":
            
            return <Sweepstake />
        case "/roadtrip":
            return <RoadtripPlanner />
        case "/signup":
            return <SignUp />;
        default:
        case "/login":
            return <Login />
    }
}

export default Switch;