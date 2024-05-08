import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Grid, TextField, Button, Typography} from '@mui/material';
import config from './config.json'; 
import '@fontsource/roboto'
import './App.css';

const customStyles = {
  title: {
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: '20px',
    marginTop: '40px'
  },
  formContainer: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  inputField: {
    width: '100%'
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

const RankingYearsPage = () => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { field: 'player_name', headerName: 'Name', flex: 1 },
    { field: 'country_id', headerName: 'Country', flex: 1},
    { field: 'avg_player_rank', headerName: 'Average Player Rank', flex: 1 },
  ];

  const fetchTopRankedPlayers = async () => {
    try {
      setIsLoading(true);
      const url = `http://${config.server_host}:${config.server_port}/player_ranking_years/${startYear}` + `0101` + `/${endYear}` + `0101`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const resJson = await response.json();
      setData(resJson);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error('Error fetching top ranked players:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchTopRankedPlayers();
  };

  function getRowId(row) {
    return row.player_id;
  }
  
  return (
    <Container>
      <Typography variant="h4" style={customStyles.title}>
        Welcome to the Ranking by Year Page
      </Typography>
      <Typography variant="h6" style={customStyles.title}>
        Enter the start date and end date you would like to view rankings from!
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} justifyContent="center" style={customStyles.formContainer}>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              fullWidth
              style={customStyles.inputField}
              sx={customStyles.textField}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              fullWidth
              style={customStyles.inputField}
              sx={customStyles.textField}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              type="submit"
              variant="contained"
              style={customStyles.button}
              fullWidth
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
      {isLoading ? (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>
          Hitting balls, running down the court, finding players ...
        </Typography>
      ) : (
        <div style={customStyles.dataGrid}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            getRowId={getRowId}
            autoHeight
          />
        </div>
      )}
    </Container>
  );
};

export default RankingYearsPage;
