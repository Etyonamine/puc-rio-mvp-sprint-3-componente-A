import React from 'react';
import { Component } from 'react';
import Box from '@mui/material/Box';

export default class TituloPagina extends Component {
    render() {
        return (
            <Box component = "div"   
                sx={{
                   /*  width: 300,*/
                    height: 30, 
                    backgroundColor: 'primary.dark',
                    color: '#fff',
                    '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                    },
                }}              
            >
                <h2>{this.props.titulo}</h2>
            </Box>
        )
        
    }
}