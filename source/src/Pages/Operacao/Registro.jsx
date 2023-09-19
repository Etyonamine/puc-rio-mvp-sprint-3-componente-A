import React from "react";
import TituloPagina from '../../components/TituloPagina';
import ListaOperacao from '../../components/operacao/ListaOperacao';

const Registro = () => {  
    return (
        <div>
            <TituloPagina titulo = "Lista de registros de Operações"/>
            <ListaOperacao />
        </div>
    );
};

export default Registro;