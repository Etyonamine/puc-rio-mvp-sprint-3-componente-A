import * as React from 'react';
import { Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MarcaSalvarNovoRegistro(props) {

    const [salvando, setSalvando] = useState(false);
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [mensagemErroTexto, setMensagemErroTexto] = React.useState('');
    const navigate = useNavigate();

    const salvarRegistro = () => {
        
        let nomeMarca = props.nome;

        // validando 
        if (nomeMarca === null || nomeMarca.trim() === '') {
            handleMensagemComErro('Por favor, informar o nome da Marca de veículo!');
            return false;
        }

        //Utilizando a API
        setSalvando(true);
        let url = `${import.meta.env.VITE_URL_API_VEICULO}/marca`;        
        
        try {
            
            const data = new FormData();
            data.append("nome", nomeMarca);

            fetch(url,
                {
                    method: 'POST',
                    body: data 
                })
                .then((response) => {
                    if (response.status === 200) {
                        handleMensagemComSucesso();
                    }
                    else if (response.status === 409) {
                        handleMensagemComErro('A Marca já existe!');
                    }
                    else {
                        handleMensagemComErro('');
                       
                    }
                })
        } catch (error) {
            if (error.message === "Failed to fetch")
            {
                 // get error message from body or default to response status                    
                 alert('A comunicação com os serviços de Marca de Veículos está com problemas!');
                 return Promise.reject(error);
            } 
            handleMensagemComErro(error);
        }
    }

    const handleClose = () => {
        
        handleCloseMensagemComErro();
        handleCloseMensagemSucesso();
    };

    const handleCloseMensagemSucesso = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMensagemComSucesso(false);
        setSalvando(false);

    };

    const handleCloseMensagemComErro = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMensagemComErro(false);

    };

    const handleMensagemComErro = (erro) => {
        setMensagemComErro(true);
        setMensagemErroTexto(erro);
       
        setTimeout(() => {
            setSalvando(false);            
        }, 3000);      
    }

    const handleMensagemComSucesso = () => {
        setMensagemComSucesso(true);
       

        setTimeout(() => {
            setSalvando(false);
            handleClose();            
            redirect();            
        }, 4000);

    };

    const redirect = () => {
        navigate('/Marca');
      };

    return (
        <>
            <Button
                variant="contained"
                endIcon={<SaveIcon />}
                color="success"
                onClick={salvarRegistro}
                disabled={salvando}
            >
                Salvar
            </Button>
            <BotaoVoltar disabled = {salvando} />

            {/* ********************** mensagem com sucesso *************** */}
            <Snackbar open={mostrar_mensagem_sucesso} autoHideDuration={3000} onClose={handleCloseMensagemSucesso}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Alert onClose={handleCloseMensagemSucesso} severity="success" sx={{ width: '100%' }}>Registro salvo com sucesso!</Alert>
            </Snackbar>

            {/* ********************** mensagem com erro *************** */}
            <Snackbar open={mostrar_mensagem_com_erro} autoHideDuration={3000} onClose={handleCloseMensagemComErro}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Alert onClose={handleCloseMensagemComErro} severity="error" sx={{ width: '100%' }}>Ocorreu o erro: <b> {mensagemErroTexto} </b></Alert>
            </Snackbar>
        </>
    );

}