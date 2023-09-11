import React, { useState } from 'react';
import {
    Alert,
    Snackbar,
    Box,
    Button,
    TextField
} from '@mui/material';

import BotaoVoltar from '../Botoes/BotaoRetornar';
import { useNavigate } from 'react-router-dom';


const TipoOperacaoFormNovo = () => {

    const [sigla, setSigla] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = React.useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [nomeCampo, setNomeCampo] = useState('');

    const navigate = useNavigate();

    const redirect = () => {
        navigate('/TipoOperacao');
    };

    const handleMensagemComSucesso = () => {
        setMensagemComSucesso(true);
        setTimeout(() => {            
            redirect();
        }, 5000);
    };

    const SalvarRegistro = () => {

        if (!ValidarCampos()) {
            return false;
        }

        const url = `${import.meta.env.VITE_URL_API_OPERACAO}/tipo_operacao`;
        const data = new FormData();

        data.append("sigla", sigla);
        data.append("descricao", descricao);

        try {

            fetch(url,
                {
                    method: 'POST',
                    body: data
                })
                .then((response) => {

                    if (response.status === 200) {
                        handleMensagemComSucesso();
                    } else {
                        handleMensagemComErro(error);
                    }
                })
        } catch (error) {
            handleMensagemComErro(error);
        }

    };

    const ValidarCampos = () => {
        if (sigla.trim().length == 0) {

            setNomeCampo('Sigla');
            setMensagemComErro(true);
            return false;
        }
        if (descricao.trim().length == 0) {

            setNomeCampo('Descrição');
            setMensagemComErro(true);
            return false;
        }
        return true;
    };

    const handleCloseMensagemSucesso = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMensagemComSucesso(false);

    };

    const handleCloseMensagemComErro = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }
        setMensagemComErro(false);
        setNomeCampo('');
    };

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
            <Button variant="contained" color="success" onClick={SalvarRegistro}>
                Salvar
            </Button>
            <BotaoVoltar />

            <Snackbar open={mostrar_mensagem_sucesso} autoHideDuration={3000} onClose={handleCloseMensagemSucesso}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Alert onClose={handleCloseMensagemSucesso} severity="success" sx={{ width: '100%' }}>Registro salvo com sucesso!</Alert>
            </Snackbar>

            <Snackbar open={mostrar_mensagem_com_erro} autoHideDuration={3000} onClose={handleCloseMensagemComErro}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Alert onClose={handleCloseMensagemComErro} severity="error" sx={{ width: '100%' }}>Atenção!O Campo <b>[ {nomeCampo} ]</b> está vazio ou a informação é inválida!</Alert>
            </Snackbar>


        </div>
    );
}
export default TipoOperacaoFormNovo;