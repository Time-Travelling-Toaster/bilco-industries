import Participant from "./Participant";

const ParticipantTable = ({ participants }) => {
    const rows = participants.reduce((reducer, participant, index) => {       
        if (index === 0) {
            return [ [participant] ];
        }
        if ((index) % 3 === 0) {
            return [ ...reducer, [participant] ];
        }

        const [ row, ...rest ] = reducer.reverse();
        return [ ...rest.reverse(), [...row, participant] ];
    }, [])

    return (
        rows.map(row => (
            <div className="row">
                {row.map(({name, picks}) => <Participant name={name} picks={picks} /> )}
            </div>
        ))
    )
}

export default ParticipantTable;