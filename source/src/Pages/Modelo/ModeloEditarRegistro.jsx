import React, { useState, useEffect,forwardRef } from 'react';
import TituloPagina from '../../components/TituloPagina';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,  
    TextField
} from '@mui/material';
import BotaoRetornar from '../../components/Botoes/BotaoRetornar';
import { useParams } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const ModeloEditarRegistro = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const { id } = useParams();
    const [salvando, setSalvando] = useState(false);
    const [codigoMarca, setCodigoMarca] = React.useState('');
    const [marcasEncontradas, setListaMarcas] = useState([]);
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [mensagemErroTexto, setMensagemErroTexto] = React.useState('');

    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleChange = (event) => {
        setCodigoMarca(event.target.value);
    };

    useEffect(() => {
        ListaMarcas();
        getModelo();

    }, []);

    const ListaMarcas = () => {
        fetch(`${import.meta.env.VITE_URL_API_VEICULO}/marcas`)
            .then(response => response.json())
            .then(responseData => {
                setListaMarcas(responseData.lista);

            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                    return Promise.reject(error);
                }
            });
    }

    const getModelo = () => {
        fetch(`${import.meta.env.VITE_URL_API_VEICULO}/modelo_id?codigo=${id}`)
            .then(response => response.json())
            .then(responseData => {

                setNome(responseData.nome);
                setCodigoMarca(responseData.codigo_marca);

            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                    return Promise.reject(error);
                }
            });
    }

    const SalvarRegistro = () => {

        // validando 
        if (nome === null || nome.trim() === '') {
            handleMensagemComErro('Por favor, informar o nome do Modelo do veículo!');
            return false;
        }

        //Utilizando a API
        setSalvando(true);
        let url = `${import.meta.env.VITE_URL_API_VEICULO}/modelo`;

        try {

            const data = new FormData();
            data.append("codigo", id);
            data.append("marca_id", codigoMarca);
            data.append("nome", nome);

            fetch(url,
                {
                    method: 'PUT',
                    body: data

                })
                .then((response) => {
                    if (response.status === 204) {
                        handleMensagemComSucesso();
                    }
                    else if (response.status === 409) {
                        handleMensagemComErro('O modelo já existe!');
                    }
                    else {
                        handleMensagemComErro('');

                    }
                })
        } catch (error) {
            if (error.message === "Failed to fetch") {
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
            redirecionar();
        }, 4000);

    };

    const redirecionar = ()=>{
        navigate('/Modelo');
    }
 
    return (

        <div>
            <div>
                <TituloPagina titulo="Cadastro de Modelo de Veículo - Editar registro" />
            </div>

            <br />

            <div>
                <FormControl sx={{ minWidth: 300 }} noValidate
                    autoComplete="off">

                    <InputLabel id="lblSelectMarca">Marca</InputLabel>
                    <Select
                        displayEmpty
                        id="marcas_select"
                        value={codigoMarca}
                        label="Marca"
                        onChange={handleChange}

                    >
                        <MenuItem value={""}>Selecione uma marca</MenuItem>
                        {
                            marcasEncontradas.map((row) => (
                                <MenuItem value={row.codigo}>{row.nome}</MenuItem>
                            ))
                        }
                    </Select>

                </FormControl>
                &nbsp;
                <FormControl
                    sx={{ minWidth: 400 }}
                    noValidate
                    autoComplete="off" >
                    <TextField
                        required
                        id="outlined-required"
                        label="Nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                </FormControl>

            </div>

            <br />

            {/* ********************** botões *************** */}
            <div>
                <Button
                    variant="contained"
                    endIcon={<SaveIcon />}
                    color="success"
                    onClick={SalvarRegistro}
                    disabled={salvando}
                >
                    Salvar
                </Button>
                &nbsp;
                <BotaoRetornar disabled = {salvando} />
            </div>

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
        </div>
    )
}
export default ModeloEditarRegistro;