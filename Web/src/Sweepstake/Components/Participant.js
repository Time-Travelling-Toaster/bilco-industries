import React from 'react';

const Participant = ({ name, picks }) => {
    return (
        <div className='participant'>
            <h3 className='name' >{name}</h3>
            <ul className='picks'>
                {picks.map(pick => 
                    <li className='pick' key={pick._id}>
                        {pick.name} {' '}
                        {pick.odds}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Participant;
