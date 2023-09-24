import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';
import ExitIcon from '@mui/icons-material/ExitToAppOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormataData from '../Shared/FormatarData';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ListaOperacao() {

    const [operacoes, setOperacoes] = useState([]);     
    const [codigo, setCodigo] = useState(0);

    const [open, setOpen] = React.useState(false);
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [textoComErro, setTextoComErro] = useState('');

    const urlOperacaoBase = `${import.meta.env.VITE_URL_API_OPERACAO}`;

    const [dataEntrada, setDataEntrada] = React.useState(dayjs(new Date()));

    useEffect(() => {
        getLista();
        setDataEntrada(new Date());


    }, []);

    useEffect(() => {
        getLista();

    }, [dataEntrada]);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
            fontSize: 12
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const handleClose = () => {
        setOpen(false);
        handleCloseMensagemComErro();
        handleCloseMensagemSucesso();
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

    };
    const excluirRegistro = () => {

        const data = new FormData();
        data.append("codigo", codigo);

        try {

            fetch(`${urlOperacaoBase}/operacao`,
                {
                    method: 'DELETE',
                    body: data

                })
                .then((response) => {
                    if (response.status === 204) {
                        handleMensagemComSucesso();
                    }
                })
        } catch (error) {
            if (error.message === "Failed to fetch") {
                // get error message from body or default to response status                    
                alert('A comunicação com os serviços de Modelos de Veículos está com problemas!');
                return Promise.reject(error);
            }
            handleMensagemComErro(error);
        }
    }

    const handleMensagemComSucesso = () => {
        setMensagemComSucesso(true);
        setTimeout(() => {
            handleClose();
            getLista();
        }, 4000);

    };

    const handleMensagemComErro = (erro) => {
        setTextoComErro(erro);
        setMensagemComErro(true);
    }

    const AbrirModalExcluir = (data) => {


        setCodigo(data.codigo);
        setOpen(true);
    }

    const getLista = () => {
        let dataParam = FormataData(dataEntrada);

        fetch(`${urlOperacaoBase}/operacao_data_entrada?data_entrada=${dataParam}`)
            .then(response => response.json())
            .then(responseData => {
                setOperacoes(responseData.lista);
            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com o serviço de consulta de operacoes está com problemas!');

                }
            });
    }

    return (
        <div>
            {/* TITULO  ********************************************************************************** */}
            <Box
                component="div"
                sx={{
                    height: 60,
                    width: '100%',
                    marginTop: 1,
                    marginBottom: 1

                }}
            >
                <Stack direction="row" >
                    <Button variant="contained" color="primary">
                        <Link style={{ textDecoration: "none", color: "white" }} to={`/OperacaoFormulario`}>Entrada</Link>
                    </Button>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DatePicker
                        id="dataEntrada"
                        label="Data-Entrada"
                        value={dayjs(dataEntrada)}
                         onChange={(newValue) => setDataEntrada(newValue)}
                        inputProps={{
                            style: { fontSize: 14, textAlign: 'left', width: 100 },

                        }}
                    />
                </LocalizationProvider>

                </Stack>
            </Box>
            {/* TABELA  ********************************************************************************** */}
            <Box
                component="div"
            >
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="lista">
                        <TableHead sx={{ height: 40 }}>
                            <TableRow>
                                <StyledTableCell align="center">Código</StyledTableCell>
                                <StyledTableCell align="center">Veiculo-Placa</StyledTableCell>
                                <StyledTableCell align="center">Data-Entrada</StyledTableCell>
                                <StyledTableCell align="center">Data-Saida</StyledTableCell>
                                <StyledTableCell align="center">tipo</StyledTableCell>
                                <StyledTableCell align="center">Observação</StyledTableCell>
                                <StyledTableCell align="center">Ação</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >

                            {

                                operacoes.map((row) => (
                                    <StyledTableRow
                                        key={row.codigo}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 40 }}
                                    >
                                        <StyledTableCell align='center'
                                            component="th"
                                            scope="row"
                                            divider={<Divider orientation="vertical" flexItem />}
                                        >
                                            {row.codigo}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.placa_veiculo}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {new Date(row.data_entrada).toLocaleString().replace(',', ' - ')}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.data_saida !== null ?new Date(row.data_saida).toLocaleString().replace(',', ' - '):''}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {`${row.tipo_operacao[0].sigla} - ${row.tipo_operacao[0].descricao}`}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.observacao}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Button
                                                                variant="contained"
                                                                sx={{ fontSize: 11 }}
                                                                color="primary"
                                                                size="small"
                                                                endIcon={<EditIcon />}
                                                                disabled={row.data_saida !== null}>
                                                                <Link style={{ textDecoration: "none", color: "white" }} to={`/OperacaoFormulario/${row.codigo}`}>Editar</Link>
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button sx={{ fontSize: 11 }}
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<ExitIcon />}
                                                                color='success'
                                                                disabled={row.data_saida !== null}
                                                            >
                                                                <Link style={{ textDecoration: "none", color: "white" }} to={`/OperacaoSaida/${row.codigo}`}>Saída</Link>
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button sx={{ fontSize: 11 }}
                                                                variant="contained"
                                                                size="small"
                                                                endIcon={<DeleteIcon />}
                                                                color='error'
                                                                onClick={() => AbrirModalExcluir(row)}
                                                                disabled={row.data_saida !== null}>
                                                                Excluir
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Dialog exclusao ********************************************************************************** */}
            <Box
                component="div"
            >
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title"
                        sx={{
                            bgcolor: 'red',
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
                        Tipo de Operação - Excluir
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
                            Tem certeza que deseja excluir o registro com o código <b> [ {codigo} ]</b>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button id="contained" onClick={excluirRegistro}>SIM</Button>
                        <Button id="contained" onClick={handleClose} autoFocus>NÃO</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar open={mostrar_mensagem_sucesso} autoHideDuration={3000} onClose={handleCloseMensagemSucesso}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <Alert onClose={handleCloseMensagemSucesso} severity="success" sx={{ width: '100%' }}>Registro excluido com sucesso!</Alert>
                </Snackbar>
                <Snackbar open={mostrar_mensagem_com_erro} autoHideDuration={3000} onClose={handleCloseMensagemComErro}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}
                >
                    <Alert onClose={handleCloseMensagemComErro} severity="error" sx={{ width: '100%' }}>Não é possível excluir o registro! <b>{textoComErro}</b></Alert>
                </Snackbar>
            </Box>
        </div>
    );
}