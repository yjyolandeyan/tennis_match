import React, { useEffect, useState } from 'react';
import { createApi } from 'unsplash-js';
import './App.css';

// get API key
const unsplash = createApi({
  accessKey: "S8pdd425hJfWm_DXiOsvdATsark_FrjVN71uOy8Nihw",
});

const PlayerCardPage = ({ firstName, lastName }) => {
  const [playerData, setPlayerData] = useState({});

  // format birthday
  function formatBirthday(birthday) {
    birthday = birthday + "";
    if (birthday.length !== 8) {
      return 'Invalid Date';
    }
    const year = birthday.substring(0, 4);
    const month = birthday.substring(4, 6);
    const day = birthday.substring(6);

    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // format gender
  function formatGender(gender) {
    if (gender === 0) {
      return 'Male';
    } else {
      return 'Female';
    }
  }

  // fetch player card data
  const fetchPlayerCards = async () => {
    try {
      const urlWomen = `http://localhost:8080/all_player_card_woman`;
      const urlMen = `http://localhost:8080/all_player_card_man`;

      const responseWomen = await fetch(urlWomen);
      const responseMen = await fetch(urlMen);

      if (!responseWomen.ok || !responseMen.ok) {
        throw new Error('Failed to fetch player data');
      }

      const playersWomen = await responseWomen.json();
      const playersMen = await responseMen.json();
      const combinedPlayers = [...playersWomen, ...playersMen];

      if (combinedPlayers && combinedPlayers.length > 0) {
        const playersWithImages = await Promise.all(combinedPlayers.map(async (player) => {
          const imageUrl = await fetchPlayerImage(player.first_name, player.last_name);
          return { ...player, imageUrl };
        }));

        setPlayerData(playersWithImages);
      } else {
        console.log('No player data returned from the server');
      }
    } catch (error) {
      console.error('Error fetching player cards:', error);
    }
  };

  // fetch images for player cards
  const fetchPlayerImage = async (firstName, lastName) => {
    try {
      const response = await unsplash.search.getPhotos({
        query: `${firstName} ${lastName}`,
        page: 1,
        perPage: 1,
      });

      const results = response.response;
      if (results && results.results && results.results.length > 0) {
        return results.results[0].urls.regular;
      } else {
        return null;
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchPlayerCards();
  }, []);

  // return the player card
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '20px'
    }}>
      {Array.isArray(playerData) ? (
        playerData
          .filter(player => player.imageUrl)
          .filter(player => {
            if (firstName && lastName) {
              return player.first_name === firstName && player.last_name === lastName;
            }
            return true;
          })
          .map((player, index) => (
            <div key={index} style={{
              backgroundColor: '#FBFF80',
              borderRadius: '20px',
              padding: '1rem',
              margin: '10px',
              width: '250px',
              boxSizing: 'border-box',
              border: '5px solid black',
              boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
              color: 'black',
              fontFamily: '"Roboto", sans-serif',
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius: '15px',
                border: '1px solid white',
                pointerEvents: 'none',
              }}></div>
              <img src={player.imageUrl} alt={`${player.first_name} ${player.last_name}`} style={{
                width: '120px',
                height: '120px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '3px solid black',
                boxSizing: 'border-box',
                marginBottom: '10px',
                marginTop: '10px',
              }} />
              <h2>{player.first_name} {player.last_name}</h2>
              <div style={{ textAlign: 'left', marginLeft: '10%', marginRight: '10%' }}>
                <p>Hand: {player.hand}</p>
                <p>Birthday: {formatBirthday(player.birthday)}</p>
                <p>Country: {player.country}</p>
                <p>Gender: {formatGender(player.gender)}</p>
              </div>
            </div>
          ))
      ) : (
        <p>Hitting balls, running down the court, finding players …</p>
      )}
    </div>
  );
};

export default PlayerCardPage;
