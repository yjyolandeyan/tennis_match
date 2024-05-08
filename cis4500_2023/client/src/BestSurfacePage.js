import React, { useState, useEffect } from 'react';
import { Container, Typography, Button} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from './config.json';

const BestSurfacePage = () => {
  const [playerData, setPlayerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [surface, setSurface] = useState('Hard')

  const buttonStyle = {
    height: '40px', 
    backgroundColor: 'black', 
    color: 'white',
    '&:hover': {
      backgroundColor: 'black' 
    },
    marginBottom: '20px',
    textAlign: 'center'
  };

  const getRandomSurface = () => {
    const surfaces = ['hard', 'clay', 'grass', 'carpet'];
    setSurface(surfaces[Math.floor(Math.random() * surfaces.length)]);
  };

  const fetchBestSurfaceData = async () => {
    try {
      getRandomSurface();
      const response = await fetch(`http://${config.server_host}:${config.server_port}/best_surface/${surface}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPlayerData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching best surface data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSurfaceData();
  }, []);

  const columns = [
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'best_surface', headerName: 'Best Surface', flex: 1 },
    { field: 'total_wins', headerName: 'Total Wins', flex: 1 },
    { field: 'total_matches', headerName: 'Total Matches', flex: 1 },
    {
      field: 'win_rate',
      headerName: 'Win Rate',
      flex: 1,
      valueFormatter: (params) =>
        params.value !== undefined ? `${params.value.toFixed(2)}%` : '',
    },
  ];


  return (
    <Container>
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        Fun Fact: Players Best on Random Surface
      </Typography>
      <Typography variant="h6" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        Explore who plays best on each surface with their win rate on that surface!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchBestSurfaceData}
        style={buttonStyle}
        justifyContent="center"
      >
        Explore Another Surface
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={playerData}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          getRowId={(row) => row.player_id}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </div>
    </Container>
  );
};

export default BestSurfacePage;
