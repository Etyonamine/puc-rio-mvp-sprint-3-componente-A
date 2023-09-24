import React, { Component } from 'react';
import {
  Box,
  Stack,
  Typography
} from '@mui/material';
class TempoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: 0,
      desc: '',
      icon: '',
      loading: true
    }
  }
  componentDidMount() {
    const api_key = `http://api.openweathermap.org/data/2.5/weather?q=São Paulo&units=Metric&APIkey=${import.meta.env.VITE_TEMPO_API_KEY}`;

    fetch(api_key)
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          temp: responseData.main.temp,
          min: responseData.main.temp_min,
          max: responseData.main.temp_max,
          humi: responseData.main.humidity,
          desc: responseData.weather[0].description,
          icon: responseData.weather[0].icon,
          loading: false
        });
      });
  }
  render() {
    const imgSrc = 'http://openweathermap.org/img/w/' +
      this.state.icon + '.png';

    if (this.state.loading) {
      return <p>Loading</p>;
    }
    else {
      return (
        <div>
           
          <Box
            component='div'
            
          >
            <Stack  >
              <Typography sx={{fontSize:12}} marginTop = 'bottom'>
                Cidade: São Paulo
              <img src={imgSrc} alt="Weather icon"  width="30" height="30" />    </Typography>
              <Typography sx={{fontSize:11}}>Temperature:&nbsp; {this.state.temp} °C</Typography>
              <Typography sx={{fontSize:11}}>Min: &nbsp;{this.state.min} °C </Typography>
              <Typography sx={{fontSize:11}}> Max:&nbsp; {this.state.max} °C</Typography>
              <Typography sx={{fontSize:11}}> Umidade(%):&nbsp; {this.state.humi}</Typography> 
            </Stack>

          </Box>
        </div>
      );
    }
  }
}
export default TempoApp;