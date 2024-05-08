import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import PlayerCardPage from './PlayerCardPage';
import RankingPage from './RankingPage';
import MatchUpPage from './MatchUpPage';
import HomePage from './HomePage';
import RankingYearsPage from './RankingYearsPage';
import RankingGenderPage from './RankingGenderPage';
import FunFactPage from './FunFactPage';
import './App.css';
import MostLossesPage from './MostLossesPage';
import UnstablePlayerPage from './UnstablePlayerPage';
import PlayersImprovePage from './PlayersImprovePage';
import BestSurfacePage from './BestSurfacePage';

const App = () => {
  const [funFactRoute, setFunFactRoute] = useState('/default-fun-fact-route'); // Set a default or initial route if necessary


  const dropdownStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const dropdownContentStyle = {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '150px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
    padding: '10px 10px',
    borderRadius: '2px'
  };

  const dropdownLinkStyle = {
    color: 'black',
    padding: '10px 10px',
    textDecoration: 'none',
    display: 'block'
  };


  const headerStyle = {
    backgroundColor: 'black',
    color: 'white',
    padding: '10px 0',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const navStyle = {
    backgroundColor: '#FBFF80', 
    padding: '10px 0',
    display: 'flex',
    justifyContent: 'center'
  };

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    margin: '0 15px',
    fontSize: '18px'
  };

  const getRandomRoute = () => {
    const routes = ['/most-losses', '/unstable', '/improve', '/surface'];
    const randomIndex = Math.floor(Math.random() * routes.length);
    return routes[randomIndex];
  };

  useEffect(() => {
    setFunFactRoute(getRandomRoute());
  }, []);

  // Function to update the fun fact route on click
  const updateFunFactRoute = () => {
    setFunFactRoute(getRandomRoute());
  };

  return (
    <Router>
      <div className='app'>
        <header style={headerStyle}>
          <span role="img" aria-label="tennis ball" style={{ marginRight: '10px' }}>🎾</span>
          <span style={{ fontStyle: 'italic' }}>TennisToday</span>
        </header>
        <nav className='funfact' style={navStyle}>
          <Link to="/" style={linkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Home</Link>
          <Link to="/player-card" style={linkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Player Card</Link>
          <Link to="/match-up" style={linkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Match-Up</Link>
          <Link
            to={funFactRoute}
            style={linkStyle}
            onClick={updateFunFactRoute}
            onMouseOver={({ target }) => (target.style.textDecoration = 'underline')}
            onMouseOut={({ target }) => (target.style.textDecoration = 'none')}
          >
            Fun Facts
          </Link>
          <div style={dropdownStyle}
            onMouseOver={({ currentTarget }) => currentTarget.lastChild.style.display = 'block'}
            onMouseOut={({ currentTarget }) => currentTarget.lastChild.style.display = 'none'}>
            <span style={{ ...linkStyle, cursor: 'pointer' }}>Ranking</span>
            <div style={dropdownContentStyle}>
              <Link to="/ranking" style={dropdownLinkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Overall Ranking</Link>
              <Link to="/ranking-years" style={dropdownLinkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Ranking by Years</Link>
              <Link to="/ranking-gender" style={dropdownLinkStyle} onMouseOver={({ target }) => target.style.textDecoration = 'underline'} onMouseOut={({ target }) => target.style.textDecoration = 'none'}>Ranking by Gender</Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/player-card" element={<PlayerCardPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/match-up" element={<MatchUpPage />} />
          <Route path="/ranking-years" element={<RankingYearsPage />} />
          <Route path="/ranking-gender" element={<RankingGenderPage />} />
          <Route path="/fun-fact" element={<FunFactPage />} />
          <Route path="/most-losses" element={<MostLossesPage />} />
          <Route path="/unstable" element={<UnstablePlayerPage />} />
          <Route path="/improve" element={<PlayersImprovePage />} />
          <Route path="/surface" element={<BestSurfacePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
