import React from "react";
import { Typography, Box } from "@mui/material";
const TituloPrincipal = () => {
    return (
            <Box 
                component = "div"
                style = {{backgroundColor:"#1976d2",color: "white"}}
            >
                <Typography
                    variant="h6"
                    noWrap
                    component="a"            
                     
                >
                    SGE - Sistema de Gerenciamento de Estacionamento
                </Typography>
            </Box>     
            
        
        
    );
};

export default TituloPrincipal;