import React, { useState } from 'react';
import PlayerCard from './PlayerCardPage';
import './App.css';

const MatchUpPage = () => {
  const [firstName1, setFirstName1] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [firstName2, setFirstName2] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [searchedPlayer1, setSearchedPlayer1] = useState(null);
  const [searchedPlayer2, setSearchedPlayer2] = useState(null);
  const [matchResult1, setMatchResult1] = useState('');
  const [matchResult2, setMatchResult2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState(0);

  const pageStyle = {
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: '20px',
    padding: '20px'
  };

  const buttonStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px auto',
    display: 'block' 
  };

  const playerInputContainerStyle = {
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '10px'
  };

  const buttonContainerStyle = {
    marginTop: '20px',
    padding: '80px',
    textAlign: 'center',
    margin: '20px 0'
  };

  const inputStyle = {
    marginRight: '5px',
    padding: '8px', 
    width: '120px', 
    borderRadius: '5px',
    border: '1px solid #ccc' 
  };

  const playerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px'
  };

  const simulateButtonStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  // fetch players
  const fetchPlayer = async (firstName, lastName, setSearchedPlayer) => {
    if (!firstName.trim() || !lastName.trim()) {
      setSearchedPlayer(null);
      return;
    }

    const urls = [
      `http://localhost:8080/player_card_men/${firstName}/${lastName}`,
      `http://localhost:8080/player_card_women/${firstName}/${lastName}`
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        if (data && data.length > 0) {
          console.log(data[0]);
          setSearchedPlayer(data[0]);
          setGender(data[0].gender)
          return;
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    }
    setSearchedPlayer(null);
  };

  const handleReset = () => {
    setFirstName1('');
    setLastName1('');
    setFirstName2('');
    setLastName2('');
    setSearchedPlayer1(null);
    setSearchedPlayer2(null);
    setMatchResult1('');
    setMatchResult2('');
  };

  const handleSimulateMatch = async () => {
    // handle simulation
    try {
      setIsLoading(true);
      var url = '';
      if (gender == 0) {
        url = `http://localhost:8080/winning_stat_men/${searchedPlayer1.id}/${searchedPlayer2.id}`
      } else {
        url = `http://localhost:8080/winning_stat_women/${searchedPlayer1.id}/${searchedPlayer2.id}`
      }
      const responseSimulation = await fetch(url);
      const simulation = await responseSimulation.json();
      console.log(simulation);
      setMatchResult1(getSimData(simulation)[0]);
      setMatchResult2(getSimData(simulation)[1]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error('Error fetching simulation data:', error);
    }
  };

  const getSimData = (i) => {
    var win_percentage = 0;
    var temp = i[0].first_name;
    console.log(i[0].win_percentage);
    if (i[0].win_percentage < i[1].win_percentage) {
      win_percentage = i[1].win_percentage;
      temp = i[0].first_name + " " + i[0].last_name;
    } else {
      win_percentage = i[0].win_percentage;
      temp = i[1].first_name + " " + i[1].last_name;
    }

    var arr = [temp + " is predicted to be the winner", "with a higher winning percentage of " + (win_percentage * 100) + "%."];
    if (i[0].win_percentage === .5) {
      arr = ["It is predicted to be a tie", "both contestants have a 50% winning percentage"];
    }
    return arr;
  }

  // return page
  return (
    <div style={pageStyle}>
      <h1>Simulate a Match Between Your Favorite Players!</h1>
      <div style={playerInputContainerStyle}>
        <div>
          <input
            style={inputStyle}
            type="text"
            placeholder="Player 1 First Name"
            value={firstName1}
            onChange={(e) => setFirstName1(e.target.value)}
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Player 1 Last Name"
            value={lastName1}
            onChange={(e) => setLastName1(e.target.value)}
          />
          <button style={simulateButtonStyle} onClick={() => fetchPlayer(firstName1, lastName1, setSearchedPlayer1)}>
            Submit Player 1
          </button>
          {searchedPlayer1 && <PlayerCard firstName={searchedPlayer1.first_name} lastName={searchedPlayer1.last_name} />}
        </div>
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={handleReset}>Reset Match</button>
          <button style={buttonStyle} onClick={handleSimulateMatch}>Simulate Match</button>

          {isLoading ? (
            <p>
              <>
              Hitting balls, finding players ...
            </>
           </p>
          ) : (
            matchResult1 || matchResult2) && (
            <>
              {matchResult1 && <p>{matchResult1}</p>}
              {matchResult2 && <p>{matchResult2}</p>}
            </>
          )}
        </div>
        <div>
          <input
            style={inputStyle}
            type="text"
            placeholder="Player 2 First Name"
            value={firstName2}
            onChange={(e) => setFirstName2(e.target.value)}
          />
          <input
            style={inputStyle}
            type="text"
            placeholder="Player 2 Last Name"
            value={lastName2}
            onChange={(e) => setLastName2(e.target.value)}
          />
          <button style={simulateButtonStyle} onClick={() => fetchPlayer(firstName2, lastName2, setSearchedPlayer2)}>
            Submit Player 2
          </button>
          {searchedPlayer2 && <PlayerCard firstName={searchedPlayer2.first_name} lastName={searchedPlayer2.last_name} />}
        </div>
      </div>

    </div>
  );

};
export default MatchUpPage;