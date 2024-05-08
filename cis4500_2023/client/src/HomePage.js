import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const HomePage = () => {
    const textStyle = {
        position: 'absolute', 
        bottom: '20px',
        left: '20px', 
        textAlign: 'left', 
        color: 'black',
        fontSize: '15px',
        zIndex: 2 
    };

    const sloganStyle = {
        fontStyle: 'italic',
        fontSize: '20px',
        margin: '20px 0',
        color: 'black'
    };

    const linkStyle = {
        fontSize: '18px',
        textDecoration: 'none',
        color: 'blue', 
        margin: '0 10px'
    };

    const getRandomRoute = () => {
        const routes = ['/most-losses', '/unstable', '/improve', '/surface'];
        const randomIndex = Math.floor(Math.random() * routes.length);
        return routes[randomIndex];
      };

    return (
        <div className='home-background'>
            <div style={textStyle}> 
                <h1><b>Welcome to TennisToday!</b></h1>
                <p style={sloganStyle}>Explore player cards, rankings, and simulate a match between your favorite players!</p>
                <div>
                    <Link to="/player-card" style={linkStyle}>Player Cards</Link> |
                    <Link to="/ranking" style={linkStyle}>Rankings</Link> |
                    <Link to="/match-up" style={linkStyle}>Simulate a Match</Link> |
                    <Link to={getRandomRoute()} style={linkStyle}>Fun Facts</Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
