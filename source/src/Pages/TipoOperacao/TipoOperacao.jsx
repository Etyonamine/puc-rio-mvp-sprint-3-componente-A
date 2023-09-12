import React from "react";
import ListaTipoOperacao from "../../components/tipoOperacao/ListaTipoOperacao";
import TituloPagina from "../../components/TituloPagina";
const TipoOperacao = () => {  
    return (
        <div>
            <TituloPagina titulo = "Lista de Tipos de Operação"/>        
            <ListaTipoOperacao />
        </div>
    );
};

export default TipoOperacao;