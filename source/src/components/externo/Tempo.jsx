import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

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
          desc: responseData.weather[0].description,
          icon: responseData.weather[0].icon,
          loading: false
        });
      });
  }
  render() {
    const imgSrc = 'http://openweathermap.org/img/w/' +
      this.state.icon + '.png';


    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }));

    if (this.state.loading) {
      return <p>Loading</p>;
    }
    else {
      return (
        <Item>          
          <table>
            <tbody>
              <tr>
                <td>Cidade: São Paulo</td>
                <td><img src={imgSrc} alt="Weather icon" />    </td>
              </tr>
              <tr>
                <td colSpan="2">
                  Temperature: {this.state.temp} °C
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  Descrição: {this.state.desc}
                </td>
              </tr>
            </tbody>
          </table>          
        </Item>
      );
    }
  }
}
export default TempoApp;