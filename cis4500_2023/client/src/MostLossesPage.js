import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Grid } from '@mui/material';
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

const MostLossesPage = () => {
  const [numberOfPlayers, setNumberOfPlayers] = useState(5);
  const [playersData, setPlayersData] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchPlayersWithMostLosses = async () => {
      try {
        const response = await fetch(`http://${config.server_host}:${config.server_port}/players_with_most_losses/${numberOfPlayers}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setPlayersData(data);
      } catch (error) {
        console.error('Error fetching players with most losses:', error);
      }
    };

    fetchPlayersWithMostLosses();
  }, [numberOfPlayers]);

  const columns = [
    { field: 'first_name', headerName: 'First Name', flex: 1 },
    { field: 'last_name', headerName: 'Last Name', flex: 1 },
    { field: 'total_losses', headerName: 'Total Losses', flex: 1 },
  ];

  function getRowId(row) {
    return row.first_name + row.last_name;
  }

  return (
    <Container>
      <Typography variant="h4" style={customStyles.title}>
        Fun Fact: Players with Most Losses
      </Typography>
      <Typography variant="h6" style={customStyles.title}>
        Explore players we identified as having the most losses!
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

export default MostLossesPage;
