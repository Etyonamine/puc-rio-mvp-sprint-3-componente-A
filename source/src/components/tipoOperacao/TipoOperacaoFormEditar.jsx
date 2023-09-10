import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import BotaoVoltar from '../Botoes/BotaoRetornar';

const TipoOperacaoFormEditar = () => {
    let { id } = useParams();
    const [codigo, setCodigo] = useState('');
    const [sigla, setSigla] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSalvar = () => {
        let resposta = confirm('Tem certeza que deseja continuar?');

        if (resposta) {
            alert(codigo);
            alert(sigla);
            alert(descricao);
            const data = new FormData();
            data.append("codigo", codigo);
            data.append("sigla", sigla);
            data.append("descricao", descricao);

            fetch(`${import.meta.env.VITE_URL_API_OPERACAO}/tipo_operacao`, 
                    {
                        method: 'PUT',
                        body: data
                    })
                    .then((response) => response.json())
                    .then(responseJson => {                       
                        console.warn(responseJson);
                    })
                    .catch((error) => {
                        //display error message
                        console.warn(error);
                    });
        }
    };

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
            <br />

            <Box component="div"
                sx={{
                    textAlign: 'center',


                }}
            >

                <Button variant="contained" endIcon={<SaveIcon />} color='success' onClick={handleSalvar}>
                    Salvar

                </Button>

                <BotaoVoltar />


            </Box>

        </div>
    );



}
export default TipoOperacaoFormEditar;