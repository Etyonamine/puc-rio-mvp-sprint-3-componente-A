import React from "react";
import TituloPagina from "../../components/TituloPagina";
import TipoOperacaoFormNovo from "../../components/tipoOperacao/TipoOperacaoFormNovo";

const TipoOperacaoNovoRegistro = () => {  
    return (
        <div>
            <TituloPagina titulo = "Tipo Operação - Novo Registro"/>        
            <TipoOperacaoFormNovo />
        </div>
    );
};

export default TipoOperacaoNovoRegistro;