import { Button, MenuItem, Modal, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import './App.css';
import ParticipantTable from './Components/ParticipantTable';
import { Get, Post } from '../Helpers/CouchDb';

const sweep = 'grand_national_2022'; //TO DO make this a drop down of the dbs 
let initialised = false;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const Sweepstake = () => {
  const showAdmin = !!params.admin
  const [participants, setParticipants] = useState();
  const [modalOpen, setOpenModal] = useState(false);
  const [auctionHorse, setAuctionHorse] = useState({});
  const [auctionWinner, setAuctionWinner] = useState({});
  const [settings, setSettings] = useState();
  const [horses, setHorses] = useState();

  useEffect(() => {
    let cancel = false;
    if (cancel) return;
    if (initialised) return;

    const init = async () => {
      const settingsResponse = await Get({ db: sweep, suffix: "/settings"});
      const settingsJson = await settingsResponse.json();
      setSettings(settingsJson)
      
      const horsesResponse = await Post({ db: sweep, suffix: "/_find", body: {
        "selector": {
          "type": "horse",
          "picked": false
        },
        limit: 50
      }});
    
      const horsesJson = (await horsesResponse.json()).docs;
      setHorses(horsesJson);
    }
    
    init();
    initialised = true;

    return () => {
      cancel = true;
    }
  }, [])

  useEffect(() => {
    let cancel = false;
    if (cancel || !settings) return;

    const load = async () => {
      const response = await Post({ db: sweep, suffix: "/_find", body: {
        "selector": {
          "type": "participant"
       }
      }})
      
      const { docs } = await response.json()
      setParticipants(docs)
    }
    
    load();
    let interval;
    if (settings.updateInterval !== 0) {
      interval = setInterval(load, (settings.updateInterval * 1000));
    }

    return () => {
      cancel = true;
      clearInterval(interval);
    };
  }, [settings])

  const pick = async () => {
    const horseId = Math.floor(Math.random() * horses.length);
    const [horse] = horses.splice(horseId, 1);

    let participant;
    let participantId;
    const remaingParts = participants.filter(part => part.picked < settings.picksPerPlayer || !part.picked )
    
    participantId = Math.floor(Math.random() * remaingParts.length);
    participant = remaingParts[participantId];

    const partIndex = participants.indexOf(participant);

    participant = { ...participant, picked: (participant?.picked || 0) + 1, picks: [
      ...participant.picks,
      { _id: horse._id, name: horse.name, odds: horse.odds } 
    ]};

    participants[partIndex] = participant;
    
    const partResponse = await couchSave(participant);
    const { rev } = await partResponse.json();
    participant._rev = rev;

    setParticipants([...participants]);
    await couchSave({ ...horse, picked: true });
  }

  const auction = () => {
    const horseId = Math.floor(Math.random() * horses.length);
    const [horse] = horses.splice(horseId, 1);
    setAuctionHorse(horse);
    setOpenModal(true);
  }

  const closeAuction = async () => {
    setOpenModal(false);
    const winnerIndex = participants.indexOf(auctionWinner);
    const participant = { ...auctionWinner, picks: [
      ...auctionWinner.picks,
      { _id: auctionHorse._id, name: auctionHorse.name, odds: auctionHorse.odds } 
    ]};

    
    const partResponse = await couchSave(participant);
    const { rev } = await partResponse.json();
    participant._rev = rev;

    participants[winnerIndex] = participant;
    setParticipants([...participants]);

    await couchSave({ ...auctionHorse, picked: true });
  }

  const couchSave = async (doc) => Post({ db: sweep, body: doc});

  return (
    <div className="App">
      <header className="App-header">
        {showAdmin && participants && <div className='headRow'>
          <Modal className="modal" open={modalOpen}>
            <Box className="modalContent">
              <h1>Auction</h1>
              <h3>{auctionHorse.name}</h3>
              <h3>{auctionHorse.odds}</h3>
              <div>
                <Select 
                  onChange={({target: {value}}) => setAuctionWinner(value)}
                  defaultValue={participants[0]?.name || ""}
                >
                  {participants.map(part =>
                    <MenuItem value={part}>{part.name}</MenuItem>
                  )}
                </Select>
              </div>
              <Button onClick={closeAuction} >Assign</Button>
            </Box>
          </Modal>
          <button onClick={pick} >Generate Pick</button>
          <button onClick={auction} >Auction</button>
        </div> }
        {participants && <ParticipantTable participants={participants} />}
      </header>
    </div>
  );
}

export default Sweepstake;
