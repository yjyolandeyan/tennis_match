import React, { useState, useEffect } from 'react';
import config from './config.json';

const PlayersImprovePage = () => {
  const [playerMemo, setPlayerMemo] = useState('')

  const getRandomPlayer = () => {
    const playerMemo1 = ['Greg Hill went from ranking 1344 in 2001 to 1497 in 2006',
       'Rafael Avalos Brenes went from ranking 1162 in 2000 to 1175 in 2001',
      'Sandros Della Piana went from ranking 848 in 2000 to 1331 in 2003',
    'Jacqueline Trail went from ranking 340 in 2000 to 529 in 2004']
    var rand = Math.floor(Math.random() * playerMemo1.length)
    setPlayerMemo(playerMemo1[rand]);
  };

  useEffect(() => {
    getRandomPlayer();
  }, []);

  return (
    <div style={{
      display: 'flex',
      marginTop: '-20px',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
  }}>
      <p style={{
          fontSize: '2rem',
          textAlign: 'center'
      }}>
          {playerMemo}
      </p>
  </div>
  );
};

export default PlayersImprovePage;

