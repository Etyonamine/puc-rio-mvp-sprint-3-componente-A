import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';
import {
    Box,
    Button,
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
    TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';

import { Link } from 'react-router-dom';

import ValidadorPlaca from '../../components/Shared/ValidadorPlaca';



/* ################## rotinas de mensagem para o usuario ############################ */
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OperacaoFormulario = () => {
    const [disabled, setDisabled] = useState(false);
    const [placa, setPlaca] = useState('');
    const [veiculoCadastroOk, setVeiculoCadastroOk] = useState(false);
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

    useEffect(() => {
        ListaTipos();
    }, []);

    const HandleTipo = (event) => {
        setCodigoTipo(event.target.value);
    }

    const SalvarRegistro = () => {


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
        else {
            setSalvando(true);

            console.log(veiculoCadastroOk)
            if (veiculoCadastroOk) {
                alert('Está cadastrado!');
                setSalvando(false);
            } else {
                setOpenDialog(true);
                setSalvando(false);
            }

        }
        //cadastrando o veiculo
    }
    async function veiculoCadastrado() {
        let resultado = await consulta_placa_veiculo_cadastro();

        return resultado.statusCode === 200;
    }

    const consulta_placa_veiculo_cadastro = (() => {
        let urlConsulta = `${urlBaseVeiculo}/veiculo_placa?placa=${placa.toUpperCase().trim()}`;

        return fetch(urlConsulta)
            .then(response => {
                const statusCode = response.status;
                const data = response.json();
                return Promise.all([statusCode, data]);
            })
            .then(res => ({
                statusCode: res[0],
                data: res[1]
            }))
            .catch(error => {
                console.error(error);
                return { name: "network error", description: "" };
            });
    });

    const handleClose = () => {

        handleCloseMensagemComErro();
        handleCloseMensagemSucesso();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
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

        }, 4000);

    };

    const handlePlaca = (e) => {
        setVeiculoCadastroOk(false);
        setPlaca(e);
        if (e.length === 7) {
            if (veiculoCadastrado()) {
                setVeiculoCadastroOk(true);
            }
        }
    }
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Renderizaçã @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    return (
        <div>
            <TituloPagina titulo="Operação - Nova entrada no estacionamento" />
            <br />
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
                    onChange={e => handlePlaca(e.target.value)}
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
                            maxLength: 7,
                            width: 600,
                            style: { textTransform: "uppercase", fontSize: 12 },

                        }}
                        rows={3}


                    />

                </FormControl>
            </div>

            <br />

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

                >
                    <DialogTitle id="alert-dialog-title"
                        sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            /* boxShadow: 1,
                            borderRadius: 2, */
                            p: 2,
                            minWidth: 568,
                            height: 5,
                            width: 568,
                            fontSize: 14,

                        }}
                    >
                        Operação - Cadastrar - Validação da placa do veículo
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description"
                            sx={{
                                bgcolor: '#white',
                                color: 'black',
                                fontSize: 14,
                                textAlign: 'left'
                            }}
                        >
                            Atenção! Não existe veículo cadastrado com esta <b> [ {placa.toUpperCase().trim()} ]</b>! Deseja cadastrar?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary">
                            <Link style={{ textDecoration: "none", color: "white" }} to={`/VeiculoFormulario`}>Cadastrar</Link>
                        </Button>
                        <Button variant="contained" color={'error'} onClick={handleCloseDialog} autoFocus>Desistir</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
}

export default OperacaoFormulario;