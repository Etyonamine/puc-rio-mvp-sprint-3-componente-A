import React from "react";
import TituloPagina from "../../components/TituloPagina";
import ListaModelos from '../../components/modelo/ListaModelos';

const Modelo = () => {  
    return (
        <div>
            <TituloPagina titulo = "Lista de Modelos"/>        
            <ListaModelos />
        </div>
    );
};

export default Modelo;