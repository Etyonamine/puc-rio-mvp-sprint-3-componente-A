import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';

const OperacaoFormulario = ()=>{
    const [disabled,setDisabled] = useState(false);
    return(
        <div>
            <TituloPagina titulo="Operação - Nova entrada no estacionamento"  />
            <br />
            <BotaoVoltar disabled = {disabled}/>
        </div>
    );
}

export default OperacaoFormulario;