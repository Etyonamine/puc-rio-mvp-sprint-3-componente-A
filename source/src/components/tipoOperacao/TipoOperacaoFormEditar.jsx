import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../Botoes/BotaoRetornar';

import DialogSalvarAlteracao from './DialogSalvarAlteracaoTipoOperacao';

const TipoOperacaoFormEditar = () => {
    const { id } = useParams();
    const [codigo, setCodigo] = useState('');
    const [sigla, setSigla] = useState('');
    const [descricao, setDescricao] = useState('');


    const AtualizaDadosSalvar = (() => {
        return {
            codigo: codigo,
            sigla: sigla,
            descricao: descricao
        }
    });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL_API_OPERACAO}/tipo_operacao_id?codigo=${id}`)
            .then(response => response.json())
            .then(responseData => {
                setCodigo(responseData.codigo);
                setSigla(responseData.sigla);
                setDescricao(responseData.descricao);
            })
            .catch(error => console.error(error));
    }, []);


    return (

        <div>
            <Box
                componet="div"
            >
                <TituloPagina titulo="Cadastro de Tipo de Operação - Editar registro" />
            </Box>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    textAlign: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    id="outlined-required"
                    label="Sigla"
                    value={sigla}
                    onChange={e => setSigla(e.target.value)}
                />
                <TextField
                    required
                    id="outlined-required"
                    label="Descrição"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                />

            </Box>
            <DialogSalvarAlteracao tipoOperacaoParam={AtualizaDadosSalvar()}>Salvar</DialogSalvarAlteracao>
            <BotaoVoltar />
        </div>
    );
}
export default TipoOperacaoFormEditar;