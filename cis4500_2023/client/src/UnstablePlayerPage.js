import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Grid, textFieldClasses } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from './config.json';
import './App.css';

const customStyles = {
  title: {
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '40px'
  },
  button: {
    height: '40px',
    backgroundColor: 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'black'
    }
  },
  textField: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
  dataGrid: {
    height: 400,
    width: '100%',
    marginTop: '20px'
   
  }
};

const UnstablePlayerPage = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUnstablePlayers = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/unstable_player/${numberOfPlayers}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setPlayersData(data);
      } catch (error) {
        console.error('Error fetching unstable players:', error);
      }
    };

    fetchUnstablePlayers();
  }, [numberOfPlayers]);

  const columns = [
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'wins', headerName: 'Wins', flex: 1 },
    { field: 'losses', headerName: 'Losses', flex: 1 },
  ];

  function getRowId(row) {
    return row.first_name + row.last_name;
  }

  return (
    <Container>
      <Typography variant="h4" style={customStyles.title}>
        Fun Fact: Unstable Players
      </Typography>
      <Typography variant="h6" style={customStyles.title}>
        Explore players we identified as having a high variability between wins and losses!
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            label="Number of Players"
            value={numberOfPlayers}
            onChange={(e) => setNumberOfPlayers(e.target.value)}
            type="number"
            style={customStyles.textField}
          />
        </Grid>
      </Grid>
      {playersData.length > 0 && (
        <div style={customStyles.dataGrid}>
          <DataGrid
            rows={playersData}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            getRowId={getRowId}
          />
        </div>
      )}
    </Container>
  );
};

export default UnstablePlayerPage;
