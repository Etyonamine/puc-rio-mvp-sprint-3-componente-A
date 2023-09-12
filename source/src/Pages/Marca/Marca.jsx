import React from "react";
import TituloPagina from "../../components/TituloPagina";
import ListaMarcas from '../../components/marcas/ListaMarcas';

const Marca = () => {  
    return (
        <div>
            <TituloPagina titulo = "Lista de Marcas"/>        
            <ListaMarcas />
        </div>
    );
};

export default Marca;