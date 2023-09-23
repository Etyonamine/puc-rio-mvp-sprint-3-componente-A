import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';

import { Link, useNavigate } from 'react-router-dom';

import ValidadorPlaca from '../../components/Shared/ValidadorPlaca';



/* ################## rotinas de mensagem para o usuario ############################ */
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OperacaoFormulario = () => {

    /************* variaveis de desativação de botões ********************/
    /** botão continuar do dialog */
    const [disabled, setDisabled] = useState(false);
    /** botão salvar do veiculo */
    const [disabledSalvarVeiculo, setDisabledSalvarVeiculo] = useState(false)
    /** desativar campos de veiculos para cadastro */
    const [disabledCamposVeiculo, setDisabledCamposVeiculo] = useState(false)

    /** variavies para controle do dialogo salvar */
    const [openConfirmaSalvar, setConfirmaSalvar] = useState(false);

    const navigate = useNavigate();

    const [placa, setPlaca] = useState('');
    const [veiculoCadastroOk, setVeiculoCadastroOk] = useState(false);
    const [veiculo, setVeiculo] = useState('')
    const [escondeDadosVeiculo, setEscondeDadosVeiculo] = useState(false);
    const [observacao, setObservacao] = useState('');
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [novoRegistro, setNovoRegistro] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [tipos, setTipos] = useState([]);
    const [codigoTipo, setCodigoTipo] = useState(0);
    const [open, setOpen] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);

    /** variaveis de mensagem  */
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [mensagemErroTexto, setMensagemErroTexto] = React.useState('');

    /** variaveis dos combos - novo veiculo */
    const [codigoMarca, setCodigoMarca] = useState(0)
    const [marcasEncontradas, setListaMarcas] = useState([]);
    const [codigoModelo, setCodigoModelo] = useState('')
    const [modelosEncontrados, setListaModelo] = useState([]);
    const [codigoCor, setCodigoCor] = useState('');
    const [coresEncontradas, setListaCores] = useState([{ cor: null }]);

    /** urls de serviços */
    const urlBaseOperacao = `${import.meta.env.VITE_URL_API_OPERACAO}`;
    const urlBaseVeiculo = `${import.meta.env.VITE_URL_API_VEICULO}`;



    async function ListaTipos() {
        let urlConsulta = `${urlBaseOperacao}/tipo_operacoes`;
        let resp = await fetch(urlConsulta)
            .then(response => response.json())
            .then(responseData => setTipos(responseData.lista))
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com o serviço de tipo de operação está com problemas!');
                    return Promise.reject(error);
                }
            });
        return resp;
    }

    const HandleTipo = (event) => {
        setCodigoTipo(event.target.value);
    }

    /** Rotinas de Salvar Registro  ******************************/
    /** rotina para desabilitar os botões salvar dialogo e tela principal */
    const Desabilitar_Botao_Salvar_Dialogo_e_Principal = () => {
        setDisabled(true);
        setSalvando(true);
    }

    /** rotina para habilitar os botões salvar dialogo e tela principal */
    const Habilitar_Botao_Salvar_Dialogo_e_Principal = () => {
        setDisabled(false);
        setSalvando(false);
    }

    /** Salvar com veiculo pré cadastrado */
    const SalvarRegistro = () => {

        try {
            //validando se foi escolhido um tipo
            if (codigoTipo === undefined || codigoTipo === 0) {
                handleMensagemComErro('Tipo de Operação inválida!Por favor, verifique.');
                return false;
            }
            //validando a data
            if (!Date.parse(value.toString())) {
                handleMensagemComErro('Data e Hora de entrada inválida!Por favor, verifique.');
                return false;
            }

            //validando a placa do veiculo
            if (!ValidadorPlaca(placa)) {
                handleMensagemComErro('Placa inválida!Por favor, verifique.');
                return false;
            }

            if (!veiculoCadastroOk) {
                setOpenDialog(true);
                setDisabled(true);
                return false;
            }
            
            handleConfirmacaoSalvar();
            

        } catch {
            setSalvando(false);
        }



        //cadastrando o veiculo
    }

    /** rotina que faz uso da chamada do serviço de inclusão */
    const RegistraOperacao = () => {
        try {
           
            Desabilitar_Botao_Salvar_Dialogo_e_Principal();
            const data = new FormData();
            data.append("placa_veiculo", placa.toUpperCase().trim());
            data.append("codigo_tipo_operacao", codigoTipo);
            data.append("observacao", observacao);


            fetch(`${urlBaseOperacao}/operacao`,
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
                        Habilitar_Botao_Salvar_Dialogo_e_Principal();
           
                    }
                    else {
                        Habilitar_Botao_Salvar_Dialogo_e_Principal();
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

    /** Salvar veiculo */
    const SalvarRegistroVeiculo = () => {
        /**  valida se existe modelo */
        if (codigoModelo.length == 0) {
            handleMensagemComErro('Por favor, informar um modelo de veículo!');
            return false;
        }

        /** valida se a cor foi selecionada */
        if (codigoCor.length == 0) {
            handleMensagemComErro(`Por favor, informar uma Cor de veículo!`);
            return false;
        }
        /** Salvando o registro via serviço do veiculo */
        try {
            
            const data = new FormData();
            data.append("codigo_modelo", codigoModelo);
            data.append("cor_id", codigoCor);
            data.append("placa", placa.toUpperCase().trim());

            fetch(`${urlBaseVeiculo}/veiculo`,
                {
                    method: 'POST',
                    body: data

                })
                .then((response) => {
                    if (response.status === 200) {
                        handleMensagemComSucessoVeiculo();
                    }
                    else if (response.status === 400) {
                        handleMensagemComErro('O veiculo já existe registrado!');
                        disabledSalvarVeiculo(false);
                    }
                    else {

                        handleMensagemComErro('');
                        disabledSalvarVeiculo(false);
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

    const handleConfirmacaoSalvar =()=>{
        setConfirmaSalvar(true);
    }

    const handleSalvarRegistro = () => {
        
        RegistraOperacao();

    }
    const consulta_veiculo = () => {

        let placaPesquisar = placa.toUpperCase().trim();
        let urlConsulta = `${urlBaseVeiculo}/veiculo_placa?placa=${placaPesquisar}`;

        setVeiculo('');
        setVeiculoCadastroOk(false);
        setEscondeDadosVeiculo(true);
        if (placaPesquisar.length == 7) {
            fetch(urlConsulta)
                .then((response) => response.json())
                .then((responseData) => {
                    setVeiculo(responseData.veiculo);
                    setVeiculoCadastroOk(true);
                    setEscondeDadosVeiculo(false);
                })
                .catch(error => {

                    if (error.message === "Failed to fetch") {
                        // get error message from body or default to response status                    
                        alert('A comunicação com o serviço de veiculos está com problemas!');
                        return Promise.reject(error);
                    }

                });

        }


    }

    /** consultas  *****************************************/
    const ListaMarcas = () => {
        fetch(`${urlBaseVeiculo}/marcas`)
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
        setCodigoModelo('');
        if (codigoMarca > 0) {
            fetch(`${urlBaseVeiculo}/marca_modelo_id?codigo_marca=${codigoMarca}`)
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
        fetch(`${urlBaseVeiculo}/cores`)
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

    /** veiculo */
    useEffect(() => {
        consulta_veiculo();
    }, [placa]);

    /** tipos /marcas / cores */
    useEffect(() => {
        ListaTipos();
        ListaMarcas();
        ListaCores();
    }, []);

    //modelos conforme marca
    useEffect(() => {

        ListaModelos();

    }, [codigoMarca])

    const handleClose = () => {

        handleCloseMensagemComErro();
        handleCloseMensagemSucesso();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        consulta_veiculo();
    };

    const handleCloseDialogConfirmar = () => {
        RegistraOperacao();

    }

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

    function handleMensagemComErro(erro) {
        setMensagemComErro(true);
        setMensagemErroTexto(erro);

        setTimeout(() => {
            setSalvando(false);
        }, 3000);
    }

    const handleMensagemComSucesso = () => {
        setMensagemComSucesso(true);
        setTimeout(() => {
            Habilitar_Botao_Salvar_Dialogo_e_Principal();
            handleClose();
            redirecionar();
        }, 4000);

    };

    /** metodos do dialogo */
    /** marca */
    const handleChangeMarca = (event) => {
        setCodigoMarca(event.target.value)
    }

    /** modelo */
    const handleChangeModelo = (event) => {
        setCodigoModelo(event.target.value);
    }

    /** cor */
    const handleChangeCor = (event) => {
        setCodigoCor(event.target.value);
    }

    const handleMensagemComSucessoVeiculo = () => {
        setMensagemComSucesso(true);
        setDisabledSalvarVeiculo(true);
        setDisabled(false);
        setDisabledCamposVeiculo(true); 
    };

    const redirecionar = () => {
        navigate('/Registro');
    }

    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderizaçã @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>
            <TituloPagina titulo="Operação - Nova entrada no estacionamento" />
            <br />
            {/* ********************** placa / data / tipo*************** */}
            <Box
                component='div'

                noValidate
                autoComplete="off"
                textAlign={'left'}
            >
                {/* Placa ***************************************************** */}
                <TextField
                    required
                    id="outlined-helperText"
                    label="Placa"
                    labelrequired="*"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    inputProps={{
                        maxLength: 7,
                        style: { textTransform: "uppercase", fontSize: 14 },
                    }}
                    helperText="Digite a placa sem o traço separador"
                />

                &nbsp;

                {/* Data ***************************************************** */}
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"

                >
                    <FormControl
                        sx={{ width: 150, textAlign: 'center' }}
                    >
                        <DateTimeField
                            label="Data-Entrada"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            inputProps={{
                                style: { fontSize: 14, textAlign: 'left' },
                            }}
                        />
                    </FormControl>

                </LocalizationProvider>
                &nbsp;
                {/* Tipo ***************************************************** */}
                <FormControl
                    sx={{ width: 560, textAlign: 'center' }}
                >
                    <InputLabel id="lblSelectTipo">Tipo</InputLabel>
                    <Select

                        labelId="lblSelectTipo"
                        id="tipos_select"
                        value={codigoTipo}
                        label="Tipo"
                        inputProps={{
                            style: { fontSize: 18, minWidth: 300 },
                        }}
                        onChange={HandleTipo}
                    >
                        <MenuItem value={0} key={0} >Selecione um Tipo</MenuItem>

                        {
                            tipos.map((row) => (
                                <MenuItem value={row.codigo} key={row.codigo} >{`${row.sigla} - ${row.descricao}`}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Box>
            <br />

            {/* ********************** dados do veículo *************** */}
            <Container maxWidth="xl">
                <Box
                    component="div"
                    hidden={escondeDadosVeiculo}
                    sx={{ bgcolor: '#cfe8fc' }}
                >
                    <Typography>
                        <b>Informações do Veículo</b>
                    </Typography>
                    {/* Placa ***************************************************** */}
                    <FormControl
                        sx={{ width: 300 }}
                    >
                        <TextField
                            required
                            id="outlined-read-only-input"
                            label="Marca"
                            value={veiculo !== '' || veiculo == undefined ? veiculo.modelo[0].marca[0].nome : ''}
                            inputProps={{
                                maxLength: 7,
                                style: { textTransform: "uppercase", fontSize: 14 },
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    &nbsp;
                    <FormControl
                        sx={{ width: 300 }}
                    >
                        <TextField
                            required
                            id="outlined-read-only-input"
                            label="Modelo"
                            value={veiculo !== '' || veiculo == undefined ? veiculo.modelo[0].nome : ''}
                            inputProps={{
                                maxLength: 7,
                                style: { textTransform: "uppercase", fontSize: 14 },
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                    &nbsp;
                    <FormControl
                        sx={{ width: 300 }}
                    >
                        <TextField
                            required
                            id="outlined-read-only-input"
                            label="Cor"
                            value={veiculo !== '' || veiculo == undefined ? veiculo.cor[0].nome : ''}
                            inputProps={{
                                maxLength: 7,
                                style: { textTransform: "uppercase", fontSize: 14 },
                                readOnly: true,
                            }}
                        />
                    </FormControl>


                </Box>
            </Container>
            <br />
            {/* **********************  Observacao *************** */}
            <div>
                <FormControl
                    noValidate
                    autoComplete="off"
                    sx={{ width: 950 }}
                >


                    <TextField
                        id="outlined-helperText"
                        label="Observação"
                        labelrequired="*"
                        multiline
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        inputProps={{
                            maxLength: 300,
                            width: 600,
                            style: { textTransform: "uppercase", fontSize: 12 },

                        }}
                        rows={3}


                    />

                </FormControl>
            </div>
            <br />
            {/* ********************** Botões  ******************************** */}
            <Box
                component='div'
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
                <BotaoVoltar disabled={salvando} />
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

            {/* Dialog cadastro veiculo ********************************************************************************** */}
            <Box
                component="div"
            >
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                    maxWidth={'lg'}

                >
                    <DialogTitle id="alert-dialog-title"
                        fullWidth={true}
                        sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            /* boxShadow: 1,
                            borderRadius: 2, */
                            p: 2,
                            minWidth: 600,
                            height: 15,
                            fontSize: 18,

                        }}
                    >
                        Operação - Cadastrar - Validação da placa do veículo
                    </DialogTitle>
                    <DialogContent sx={{ textAlign: 'center' }}>
                        <DialogContentText id="alert-dialog-description"
                            sx={{
                                bgcolor: '#white',
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'left'
                            }}
                        >
                            <br />
                            <Box
                                component="div"
                                sx={{ backgroundColor: 'ButtonHighlight', color: 'black', marginLeft: '5', textAlign: 'center', marginTop: '5' }}
                                fullWidth={true}
                            >
                                Atenção! Não existe veículo cadastrado com esta <b> [ {placa.toUpperCase().trim()} ]</b>!
                                <br />
                                Deseja cadastrar? Preencha as informações e clique no botão Salvar.
                            </Box>

                        </DialogContentText>
                        <br />
                        <Container
                            maxWidth="xl"
                            fullWidth={true}
                        >
                            <Box
                                component="div"
                            /*   sx={{ bgcolor: '#cfe8fc' }} */
                            >
                                {/** ************** Marcas do veiculo *****************/}
                                <FormControl sx={{ minWidth: 200 }} noValidate
                                    autoComplete="off">

                                    <InputLabel id="lblSelectMarca" required>Marca</InputLabel>
                                    <Select

                                        labelId="lblSelectMarca"
                                        id="marcas_select"
                                        value={codigoMarca}
                                        label="Marca"
                                        onChange={(e) => handleChangeMarca(e)}
                                        disabled={disabledCamposVeiculo}
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
                                {/** ************** Modelo do veiculo *****************/}
                                <FormControl sx={{ minWidth: 500 }}>
                                    <InputLabel id="lblSelectModelo" required>Modelo</InputLabel>
                                    <Select

                                        labelId="lblSelectModelo"
                                        id="modelos_select"
                                        value={codigoModelo}
                                        label="Modelo"
                                        onChange={(e) => handleChangeModelo(e)}
                                        disabled={disabledCamposVeiculo}
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
                                {/** ************** cores do veiculo *****************/}
                                <FormControl sx={{ minWidth: 250 }}>
                                    <InputLabel id="lblSelectCores" required>Cor</InputLabel>
                                    <Select
                                        labelId="lblSelectCores"
                                        id="cores_select"
                                        value={codigoCor}
                                        label="Cor"
                                        onChange={(e) => handleChangeCor(e)}
                                        disabled={disabledCamposVeiculo}
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

                            </Box>
                            <br />
                            {/** ************** Botão Salvar veiculo *****************/}
                            <Box component="div">
                                <FormControl fullWidth>
                                    <Button variant="contained"
                                        color="primary"
                                        disabled={disabledSalvarVeiculo}
                                        onClick={SalvarRegistroVeiculo}>
                                        Salvar
                                    </Button>
                                </FormControl>
                            </Box>
                        </Container>
                    </DialogContent>
                    <DialogActions sx={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" disabled={disabled} onClick={handleConfirmacaoSalvar}>
                            Continuar
                        </Button>
                        <Button variant="contained" color={'error'} onClick={handleCloseDialogConfirmar} autoFocus>Desistir</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Dialog confirma salvar ********************************************************************************** */}
            <Box
                component="div"
            >
                <Dialog
                    open={openConfirmaSalvar}
                    onClose={handleCloseDialogConfirmar}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                    maxWidth={'lg'}

                >
                    <DialogTitle id="alert-dialog-title"
                        fullWidth={true}
                        sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            /* boxShadow: 1,
                            borderRadius: 2, */
                            p: 2,
                            minWidth: 600,
                            height: 15,
                            fontSize: 18,

                        }}
                    >
                        Operação - Novo Registro - Confirmar
                    </DialogTitle>
                    <DialogContent sx={{ textAlign: 'center' }}>
                        <DialogContentText id="alert-dialog-description"
                            sx={{
                                bgcolor: '#white',
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'left'
                            }}
                        >
                            <br />
                            <Box
                                component="div"
                                sx={{
                                    backgroundColor: 'ButtonHighlight',
                                    color: 'black',
                                    marginLeft: '5',
                                    textAlign: 'left',
                                    marginTop: '5'
                                }}
                                fullWidth={true}
                            >
                                Tem certeza que deseja continuar?
                            </Box>

                        </DialogContentText>
                        <br />
                    </DialogContent>
                    <DialogActions sx={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" disabled={disabled} onClick={handleSalvarRegistro}>
                            Sim
                        </Button>
                        <Button variant="contained" color={'error'} onClick={handleCloseDialogConfirmar} autoFocus>Não</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}

export default OperacaoFormulario;