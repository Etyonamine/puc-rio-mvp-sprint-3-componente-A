import React from "react";
import TituloPagina from "../../components/TituloPagina";
import MarcaFormNovo from "../../components/marca/MarcaSalvarNovoRegistro";

const MarcaNovoRegistro = () => {  
    return (
        <div>
            <TituloPagina titulo = "Tipo Operação - Novo Registro"/>        
            <MarcaFormNovo />
        </div>
    );
};

export default TipoOperacaoNovoRegistro;