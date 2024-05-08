import React, { useState } from 'react';
import { Grid, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '@fontsource/roboto';
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

const RankingGenderPage = () => {
  const [gender, setGender] = useState('');
  const [count, setCount] = useState('');
  const [playersData, setPlayersData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenderSelection = (event) => {
    setGender(event.target.value);
  };

  const handleCountChange = (event) => {
    setCount(event.target.value);
  };

  const handleFetchTopPlayers = async () => {
    if (gender === '' || isNaN(parseInt(count, 10))) {
      return;
    }

    const route = gender === 'male' ? '/top_player_men/' : '/top_player_women/';
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080${route}${count}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPlayersData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error('Error fetching top players:', error);
    }
  };

  const columns = [
    { field: 'player_name', headerName: 'Name', flex: 1 },
    { field: 'matches_played', headerName: 'Matches Played', flex: 1 },
  ];

  function getRowId(row) {
    return row.player_id;
  }

  return (
    <Container>
      <Typography variant="h4" style={customStyles.title}>
       Welcome to the Ranking by Gender Page!
      </Typography>
      <Typography variant="h6" style={customStyles.title}>
       Enter the sex you would like to view ranking of, additionally choose the number of responses you would like. 
      </Typography>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={customStyles.formContainer}>
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Gender:</FormLabel>
            <RadioGroup row aria-label="gender" name="gender" value={gender} onChange={handleGenderSelection}>
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            label="Enter Count"
            value={count}
            onChange={handleCountChange}
            type="number"
            style={customStyles.inputField}
            sx={customStyles.textField}
          />
        </Grid>
      </Grid>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          style={customStyles.button}
          onClick={handleFetchTopPlayers}
        >
          Get Top Players
        </Button>
      </div>
      {isLoading ? (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>
          Hitting balls, running down the court, finding players ...
        </Typography>
      ) : (
        <div style={customStyles.dataGrid}>
          <DataGrid
            rows={playersData}
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

export default RankingGenderPage;