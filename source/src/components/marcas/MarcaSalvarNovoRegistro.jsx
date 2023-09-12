import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TituloPagina from '../TituloPagina';
import BotaoVoltar from '../Botoes/BotaoRetornar';
import {
    Alert,
    Snackbar,
    Box,
    Button,
    TextField
} from '@mui/material';

const MarcaSalvarNovoRegistro = () => {    
    const [nome, setNome] = useState('');            
    const navigate = useNavigate();    

    const redirect = () => {
        navigate('/Marca');
    };    

    const SalvarRegistro = () => {

        // valida o campo
        if (!ValidarCampos()){
            return false;
        }
        //determina para qual execução será efetuado novo ou edicao
        const data = new FormData();        
        data.append("nome", nome);        
        

        try {   
            const url = `${import.meta.VITE_URL_API_VEICULO}/marca`;    

            fetch(url,
                {
                    method: 'POST',
                    body: data
                })
                .then((response) => {
                    if (response.status === 204) {
                        handleMensagemComSucesso();
                    }                     
                    else if (response.status === 409) {
                        handleMensagemComErro('A Marca já existe!');
                    }
                    else {
                        handleMensagemComErro('');
                        console.log(response);
                    }
                })
        } catch (error) {
            console.log(error);
            handleMensagemComErro(error);
        }

    } 
     
    const handleMensagemComSucesso = () => {
        setMensagemComSucesso(true);
        setTimeout(() => {
            redirect();
        }, 5000);
    };

    const ValidarCampos = () => {
        if (nome.trim().length == 0) {

            setMensagemComErro(true);

            setMensagemErroTexto(`O campo [ Nome ] está vazio ou inválido!`);

            return false;
        }        
        return true;
    };
 

    return (

        <div>
            <Box
                componet="div"
            >
                <TituloPagina titulo="Cadastro de Marca - Novo registro" />
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
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

            </Box>
            <Button variant="contained" color="success" onClick={SalvarRegistro}>
                Salvar
            </Button>
            <BotaoVoltar />
        </div>
    );

}
export default MarcaSalvarNovoRegistro;