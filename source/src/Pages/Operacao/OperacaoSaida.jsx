import React, { useState, useEffect, forwardRef } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Switch,
    Table,
    TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import SaveIcon from '@mui/icons-material/Save';
import MuiAlert from '@mui/material/Alert';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';

import { useNavigate, useParams } from 'react-router-dom';

import Titulo from '../../components/TituloPagina';
import SubTituloVeiculo from '../../components/sub-titulos/veiculos/subTituloVeiculo';
import SubTituloInformacaoOperacao from '../../components/sub-titulos/veiculos/subTituloInformacaoOperacao';
import CalcularHoraTexto from '../../components/Shared/CalcularHoraTexto';
import CalcularHoras from '../../components/Shared/CalcularHoras';

/* ################## rotinas de mensagem para o usuario ############################ */
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const OperacaoSaida = () => {
    const { id } = useParams();
    const [veiculo, setVeiculo] = useState('');
    const [operacao, setOperacao] = useState('');
    const [tipo, setTipo] = useState('')
    const [codigoTipo, setCodigoTipo] = useState('')
    const [observacao, setObservacao] = useState('');
    const [dataSaida, setDataSaida] = React.useState(dayjs(new Date()));
    const [dataEntrada, setDataEntrada] = React.useState(null);
    const [dataEntradaBase, setDataEntradaBase] = React.useState(null);
    const [horasPermanencia, setHorasPermanencia] = useState('');
    const [valorTotalPagar, setValorTotalPagar] = useState('0,00');
    const [valorHoraAvulso, setValorHoraAvulso] = useState(0);
    const [totalSegundos, setTotalSegundos] = useState('');

    const [salvando, setSalvando] = useState(false);
    const [open, setOpen] = useState(false);

    /** variaveis de mensagem  */
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [mensagemErroTexto, setMensagemErroTexto] = React.useState('');

    /** urls de serviços */
    const urlBaseOperacao = `${import.meta.env.VITE_URL_API_OPERACAO}`;
    const urlBaseVeiculo = `${import.meta.env.VITE_URL_API_VEICULO}`;

    const navigate = useNavigate();

    useEffect(() => {
        getOperacao();
        setValorHoraAvulso(import.meta.env.VITE_URL_VALOR_HORA_AVULSO);

    }, []);


    useEffect(() => {

        if (dataEntradaBase != null) {
            CalcularPermanencia();
            CalcularValorAPagar();
        }
    }, [dataSaida, dataEntradaBase]);

    const CalcularPermanencia = () => {
        let data1 = (new Date(dataEntradaBase)).toISOString().slice(0, 10).replace(/-/g, "") + ` ${new Date(dataEntradaBase).toTimeString().substring(0, 5)}`
        let data2 = (new Date(dataSaida)).toISOString().slice(0, 10).replace(/-/g, "") + ` ${new Date(dataSaida).toTimeString().substring(0, 5)}`
        let horas = CalcularHoraTexto(data1, data2);
        setHorasPermanencia(horas);
    }

    const CalcularValorAPagar = () => {
        let data1 = (new Date(dataEntradaBase)).toISOString().slice(0, 10).replace(/-/g, "") + ` ${new Date(dataEntradaBase).toTimeString().substring(0, 5)}`;
        let data2 = (new Date(dataSaida)).toISOString().slice(0, 10).replace(/-/g, "") + ` ${new Date(dataSaida).toTimeString().substring(0, 5)}`;
        let segundosTotal = CalcularHoras(data1, data2);        
        setTotalSegundos(segundosTotal);

        if (tipo.toUpperCase().indexOf('AVULSO') !== -1) {
            let valorSegundo = (valorHoraAvulso / (3600));
            let valorCalculado = ((segundosTotal / 1000) * valorSegundo);            
            setValorTotalPagar(valorCalculado.toFixed(2).replace('.', ','));
        }
        else if (tipo.toUpperCase().indexOf('MENSAL')) {
            setValorTotalPagar('0,00');
            setValorHoraAvulso(0);
        }

    }

    /** Listas */
    const getOperacao = () => {
        let urlOperacao = `${urlBaseOperacao}/operacao_id?codigo=${id}`;

        fetch(urlOperacao)
            .then(response => response.json())
            .then(data => {
                setOperacao(data);
                setDataEntrada(data.data_entrada);
                setDataEntradaBase(new Date(data.data_entrada));
                setTipo(data.tipo_operacao[0].descricao);
                setCodigoTipo(data.codigo_tipo_operacao)
                setObservacao(data.observacao);
                getVeiculo(data.placa_veiculo);

            })
            .catch(error => {
                console.log(error);
            });
    }

    const getVeiculo = (placa) => {
        let urlOperacao = `${urlBaseVeiculo}/veiculo_placa?placa=${placa}`;

        fetch(urlOperacao)
            .then(response => response.json())
            .then(data => setVeiculo(data.veiculo))
            .catch(error => {
                console.log(error);
            });
    }

    /** salvando ********************************************/
    const SalvarRegistro = () => {

        if (horasPermanencia.indexOf('-') !== -1) {
            handleMensagemComErro('Data de saída MENOR do que a da entrada!');
            return false;
        }
        try {
            setSalvando(true);
            setOpen(true);//abrindo o dialogo

        } catch (error) {
            console.log(bgColorTitulo);
            setSalvando(false);
        }

    }

    const formata_data_hora_saida = (()=>{
        let dataSaidaParam = new Date(dataSaida).toLocaleString().replace(",","");
        let horaSaidaParam = new Date(dataSaida).toTimeString();
        let retorno = `${dataSaidaParam.substring(6,10)}-${dataSaidaParam.substring(3,5)}-${dataSaidaParam.substring(0,2)} ${horaSaidaParam.substring(0,8)}`;
        return retorno;
    });

    const handle_baixa_operacao = () => {
        try {             

            const data = new FormData();
            data.append("codigo", id);
            data.append("codigo_tipo_operacao", codigoTipo);
            data.append("observacao", observacao);
            data.append("data_saida", formata_data_hora_saida());
            data.append("total_permanencia", totalSegundos);
            data.append("valor_total", valorTotalPagar.replace(',', '.'));
            data.append("valor_base_calculo", valorHoraAvulso.replace(',', '.'));

            fetch(`${urlBaseOperacao}/operacao_saida_veiculo`,
                {
                    method: 'PUT',
                    body: data

                })
                .then((response) => {
                    if (response.status === 204) {
                        handleMensagemComSucesso();

                    }
                    else if (response.status === 400) {
                        handleMensagemComErro('A operação já existe registrado!');


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

    /** ROTINAS DAS MENSAGENS DE ERRO E SUCESSO ******************************************* */
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
            handleClose();
            redirecionar();
        }, 3000);

    };

    const redirecionar = () => {
        navigate('/Registro');
    };

    /** FIM ROTINAS DE MENSAGEM ******************************************************** */


    /** rotinas do dialogo */
    const handleClose = () => {
        setOpen(false);
        setSalvando(false);
    }

    /** @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ RENDERIZANDO @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    return (
        <div>
            {/* /** Titulo *************************************/}
            <Titulo titulo="Operação - Registro da Saída do Veículo" />
            <Box
                component="div"
            >
                <Container
                    component="div"
                    sx={{ backgroundColor: "aliceblue" }}
                >
                    <SubTituloVeiculo />
                </Container>


                <Table>
                    <tbody>
                        <tr>
                            <td>
                                <b>Placa: </b> &nbsp; {operacao.placa_veiculo}
                            </td>
                            <td>
                                <b>Marca: </b> &nbsp; {veiculo !== '' || veiculo == undefined ? veiculo.modelo[0].marca[0].nome : ''}
                            </td>
                            <td>
                                <b>Modelo: </b>&nbsp; {veiculo !== '' || veiculo == undefined ? veiculo.modelo[0].nome : ''}
                            </td>
                            <td>
                                <b>Cor: </b> &nbsp; {veiculo !== '' || veiculo == undefined ? veiculo.cor[0].nome : ''}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Box>
            <br />

            {/* ********************** informações de veiculo e operacao *************** */}
            <Container
                sx={{ backgroundColor: "aliceblue", height: 350, verticalAlign: 'center' }}
            >
                <Box component='div'>
                    <SubTituloInformacaoOperacao />
                </Box>

                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br"

                >
                    <FormControl
                        sx={{ width: 200, textAlign: 'center', marginTop: 3 }}
                    >
                        <DateTimeField
                            id="dataEntrada"
                            label="Entrada"
                            value={dayjs(dataEntrada)}
                            inputProps={{
                                style: { fontSize: 16, textAlign: 'left', fontFamily: 'arial' },

                            }}
                            readOnly={true}
                        />
                    </FormControl>


                    &nbsp;

                    <FormControl
                        sx={{ width: 200, textAlign: 'center', marginTop: 3 }}

                    >
                        <DateTimeField
                            id="dataSaida"
                            label="Saida"
                            value={dataSaida}
                            onChange={(newValue) => setDataSaida(newValue)}
                            inputProps={{
                                style: {
                                    fontSize: 16, textAlign: 'left',
                                },
                            }}
                        />
                    </FormControl>
                </LocalizationProvider>
                &nbsp;
                <FormControl
                    sx={{ width: 250, marginTop: 3.1, textAlign: 'center' }}
                >
                    <TextField
                        id="outlined-read-only-input"
                        label="Permanência(H-Horas/M-Minutos)"
                        value={horasPermanencia}
                        inputProps={{
                            maxLength: 7,
                            style: { textTransform: "uppercase", fontSize: 14, textAlign: 'center' },
                            readOnly: true,
                        }}
                    />
                </FormControl>
                &nbsp;
                <FormControl
                    sx={{ width: 150, marginTop: 3.1, textAlign: 'center' }}
                >
                    <TextField
                        id="outlined-read-only-input"
                        label="Tipo"
                        value={tipo}
                        inputProps={{
                            maxLength: 7,
                            style: { textTransform: "uppercase", fontSize: 14, textAlign: 'center' },
                            readOnly: true,
                        }}
                    />
                </FormControl>

                &nbsp;
                <FormControl
                    sx={{ width: 150, marginTop: 3.1, textAlign: 'center' }}
                >
                    <TextField
                        id="outlined-read-only-input"
                        label="Valor Total"
                        value={`R$ ${valorTotalPagar}`}
                        inputProps={{
                            maxLength: 7,
                            style: { textTransform: "uppercase", fontSize: 14, textAlign: 'center' },
                            readOnly: true,
                        }}
                    />
                </FormControl>
                <br />
                <br />
                {/* **********************  Observacao *************** */}
                <Box
                    component = 'div'
                >
                    <FormControl
                        noValidate
                        autoComplete="off"
                        sx={{ width: 970 }}
                        
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
                </Box>
                <br />
                <br />
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
            </Container>

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


            {/* Dialog confirma salvar ********************************************************************************** */}

            <Dialog
                fullWidth={true}
                open={open}
                onClose={handleClose}
                maxWidth={'sm'}
                aria-labelledby="alert-dialog-title2"
                aria-describedby="alert-dialog-description2"
            >
                <DialogTitle id="alert-dialog-title2"
                    sx={{
                        bgcolor: '#1976d2',
                        color: 'white',
                        p: 2,
                        minWidth: 500,
                        height: 15,
                        fontSize: 18,

                    }}
                >
                    Operação - Registro de Saída do Veículo
                </DialogTitle>
                <DialogContent
                    id="alert-dialog-description2"
                >
                    <DialogContentText sx={{ fontSize: 14 }}>
                        Tem certeza que deseja executar a baixa de saída com as informações preenchidas?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ textAlign: 'center' }}>
                    <Button id="btnDlgSim" variant="contained" color="primary" onClick={handle_baixa_operacao}>
                        Sim
                    </Button>
                    <Button id="btnDlgNao" variant="contained" color={'error'} onClick={handleClose} autoFocus>Não</Button>
                </DialogActions>

            </Dialog>
        </div>
    );
}
export default OperacaoSaida