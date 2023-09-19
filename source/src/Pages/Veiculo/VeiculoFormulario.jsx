import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';




const VeiculoFormulario = () => {

    const [salvando, setSalvando] = useState(false);
    const { id } = useParams();
    const [placa, setPlaca] = useState('');
    const [novoRegistro, setNovoRegistro] = useState(false);
    const [tituloPaginaCorrente, setTituloPagina] = useState('');

    const navigate = useNavigate();
    const urlVeiculo = `${import.meta.env.VITE_URL_API_VEICULO}`;

    /** variaveis de mensagem  */
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [mensagemErroTexto, setMensagemErroTexto] = React.useState('');

    /** variaveis dos combos */
    const [codigoMarca, setCodigoMarca] = useState(0)
    const [marcasEncontradas, setListaMarcas] = useState([]);
    const [codigoModelo, setCodigoModelo] = useState('')    
    const [modelosEncontrados, setListaModelo] = useState([]);
    const [codigoCor, setCodigoCor] = useState('');
    const [coresEncontradas, setListaCores] = useState([{ cor: null }]);



    /** tratamento do campo placa */
    const ValidaPlaca = (valor) => {
        let regra = new RegExp(/^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/);
        return regra.test(valor);
    };

    /** ################# rotinas campo placa ################################################### */


    /** ################# rotinas combos de seleção ################################################### */
    const handleChangeMarca = (event) => {

        setCodigoMarca(event.target.value);
        


    }

    const handleChangeModelo = (event) => {
        setCodigoModelo(event.target.value);
    }

    const handleChangeCor = (event) => {
        setCodigoCor(event.target.value);
       

    }


    const ListaMarcas = () => {
        fetch(`${urlVeiculo}/marcas`)
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

    const ListaModelos = () => {
        if(codigoMarca > 0 ){
            fetch(`${urlVeiculo}/marca_modelo_id?codigo_marca=${codigoMarca}`)
            .then(response => response.json())
            .then(responseData => {

                if (responseData.lista.length > 0) {
                    setListaModelo(responseData.lista);
                }


            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                    return Promise.reject(error);
                }
            });

        }
        
    }

    const ListaCores = () => {
        fetch(`${urlVeiculo}/cores`)
            .then(response => response.json())
            .then(responseData => {
                setListaCores(responseData.lista);

            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                    return Promise.reject(error);
                }
            });
    }

    const GetVeiculo = () => {

        fetch(`${urlVeiculo}/veiculo_id?codigo=${id}`)
            .then(response => response.json())
            .then(responseData => {
                setPlaca(responseData.veiculo.placa);
                setCodigoCor(responseData.veiculo.cor[0].codigo);    
                setCodigoMarca(responseData.veiculo.modelo[0].codigo_marca);             

                setTimeout(() => {
                    setCodigoModelo(responseData.veiculo.codigo_modelo);    
                }, 200);

            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                    return Promise.reject(error);
                }
            });
    }

    /** Executando a lista */
    useEffect(() => {
        ListaMarcas();
        ListaCores();

        setTituloPagina('Cadastro de Veículo - Editar Registro')

        if (id === '' || id === 0 || id == undefined) {
            setNovoRegistro(true);
            setTituloPagina('Cadastro de Veículo - Novo Registro')

        } else {
            GetVeiculo();
        }


    }, []);

    useEffect(() => {

        ListaModelos();

    }, [codigoMarca])

    

    /** ################# rotina Salvar Registro ###################################################### */
    /** Atualizar Registro */
    const atualizarRegistro = () => {

        const data = new FormData();
        data.append("codigo_modelo", codigoModelo);
        data.append("cor_id", codigoCor);
        data.append("placa", placa);
        data.append("codigo", id);

        try {
            fetch(`${urlVeiculo}/veiculo`,
                {
                    method: 'PUT',
                    body: data

                })
                .then((response) => {
                    if (response.status === 204) {
                        handleMensagemComSucesso();
                    }
                    else if (response.status === 400) {
                        handleMensagemComErro('O veiculo já existe registrado!');
                    }
                    else {
                        handleMensagemComErro('');

                    }
                })
        }
        catch (error) {
            if (error.message === "Failed to fetch") {
                // get error message from body or default to response status                    
                alert('A comunicação com os serviços de Marca de Veículos está com problemas!');
                return Promise.reject(error);
            }
            handleMensagemComErro(error);
        }

    }

    /** novo registro */
    const GravarNovoRegitro = () => {
        try {
            const data = new FormData();
            data.append("codigo_modelo", codigoModelo);
            data.append("cor_id", codigoCor);
            data.append("placa", placa);

            fetch(`${urlVeiculo}/veiculo`,
                {
                    method: 'POST',
                    body: data

                })
                .then((response) => {
                    if (response.status === 200) {
                        handleMensagemComSucesso();
                    }
                    else if (response.status === 400) {
                        handleMensagemComErro('O veiculo já existe registrado!');
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

    /** Salvar Registro */
    const SalvarRegistro = () => {

        if (codigoModelo === 0 || codigoModelo === '') {
            handleMensagemComErro('Por favor, selecione um Modelo válido');
            return false;
        }

        if (codigoCor === 0 || codigoCor === '') {
            handleMensagemComErro('Por favor, selecione uma Cor válido');
            return false;
        }

        if (!ValidaPlaca(placa)) {
            handleMensagemComErro('Por favor, preencher com uma placa válida');
            return false;
        }

        //Utilizando a API
        setSalvando(true);

        if (novoRegistro) {
            GravarNovoRegitro();
        }
        else {
            atualizarRegistro();
        }
    }

    /* ################## rotinas de mensagem para o usuario ############################ */
    const Alert = forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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

    const redirecionar = () => {
        navigate('/Veiculo');
    }


    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderizaçã @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>

            <Box
                component="div"
            >
                <TituloPagina titulo={tituloPaginaCorrente} />
            </Box>
            <br />

            {/* ********************** Combos de seleção e placa **************************************/}
            <Box
                component="div"
            >
                <FormControl sx={{ minWidth: 200 }} noValidate
                    autoComplete="off">

                    <InputLabel id="lblSelectMarca" required>Marca</InputLabel>
                    <Select

                        labelId="lblSelectMarca"
                        id="marcas_select"
                        value={codigoMarca}
                        label="Marca"
                        onChange={(e) => handleChangeMarca(e)}
                    >
                        <MenuItem value={0} key={'ma0'} >Selecione um da lista</MenuItem>
                        {

                            marcasEncontradas.map((row) => (
                                <MenuItem value={row.codigo} key={`ma${row.codigo}`} >{row.nome}</MenuItem>
                            ))

                        }


                    </Select>
                </FormControl>
                &nbsp;
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="lblSelectModelo" required>Modelo</InputLabel>
                    <Select

                        labelId="lblSelectModelo"
                        id="modelos_select"
                        value={codigoModelo}
                        label="Modelo"
                        onChange={(e) => handleChangeModelo(e)}
                    >
                        <MenuItem value={''} key={'mo0'} >Selecione um da lista</MenuItem>
                        {
                            modelosEncontrados.map((row) => (
                                <MenuItem value={row.codigo} key={row.codigo} >{row.nome}</MenuItem>
                            ))
                        }

                    </Select>
                </FormControl>
                &nbsp;
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="lblSelectCores" required>Cor</InputLabel>
                    <Select
                        labelId="lblSelectCores"
                        id="cores_select"
                        value={codigoCor}
                        label="Cor"
                        onChange={(e) => handleChangeCor(e)}
                        required
                    >
                        <MenuItem value={''} key={'c0'} >Selecione um da lista</MenuItem>
                        {
                            coresEncontradas.map((row) => (
                                <MenuItem value={row.codigo} key={`co${row.codigo}`} >{row.nome}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                &nbsp;
                <FormControl
                    sx={{ minWidth: 80 }}
                    noValidate
                    autoComplete="off" >
                    <TextField
                        required
                        id="outlined-helperText"
                        label="Placa"
                        labelrequired="*"
                        value={placa}
                        onChange={e => setPlaca(e.target.value)}
                        inputProps={{
                            maxLength: 7,
                            style: { textTransform: "uppercase" },
                        }}
                        helperText="Digite a placa sem o traço separador"
                    />
                </FormControl>
            </Box>
            <br />

            {/* ********************** botões *****************************************/}
            <Box
                component="div"
            >
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
                <BotaoVoltar variant="contained" disabled={salvando} />
            </Box>


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


export default VeiculoFormulario;