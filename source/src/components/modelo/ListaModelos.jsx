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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ListaModelos() {
    const [modelosEncontrados, setListaModelos] = useState([]);
    const [nome, setNome] = useState('');
    const [codigo, setCodigo] = useState(0);

    const [quantidadeVeiculos, setQuantidadeVeiculos] = useState(0);

    const [open, setOpen] = React.useState(false);
    const [mostrar_mensagem_sucesso, setMensagemComSucesso] = useState(false);
    const [mostrar_mensagem_com_erro, setMensagemComErro] = useState(false);
    const [textoComErro, setTextoComErro] = useState('');

    useEffect(() => {
        getLista();

    }, []);


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
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
        try 
        {
            consulta_veiculos();

            if (quantidadeVeiculos > 0) {
                handleMensagemComErro(`Não é possível excluir! Existe [ ${quantidadeVeiculos} ] veículos(s) com este modelo!`);
                return false;
            }
            
            const data = new FormData();
            data.append("codigo", codigo);

            fetch(`${import.meta.env.VITE_URL_API_VEICULO}/modelo`,
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

        setNome(data.nome);
        setCodigo(data.codigo);
        setOpen(true);
    }

    const getLista = () => {
        fetch(`${import.meta.env.VITE_URL_API_VEICULO}/modelos`)
            .then(response => response.json())
            .then(responseData => setListaModelos(responseData.lista))
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    // get error message from body or default to response status                    
                    alert('A comunicação com o serviço de consulta de Modelo de Veículos está com problemas!');
                }
                setListaModelos([]);
                console.log(error);
            });
    }
    const consulta_veiculos = () => {
        fetch(`${import.meta.env.VITE_URL_API_VEICULO}/veiculo_modelo_id?codigo_modelo=${codigo}`)
            .then(response => response.json())
            .then(responseData => setQuantidadeVeiculos(responseData.lista.length))
            .catch(error => console.error(error));
    }
    return (
        <div>
            {/* TITULO  ********************************************************************************** */}
            <Box
                component="div"
                sx={{
                    height: 40,
                    width: '100%',
                    marginTop: 1,
                    marginBottom: 1
                }}
            >
                <Stack direction="row">
                    <Button variant="contained" color="primary">
                        <Link style={{ textDecoration: "none", color: "white" }} to={`/ModeloNovoRegistro`}>Novo registro</Link>
                    </Button>

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
                                <StyledTableCell align="center">Marca</StyledTableCell>
                                <StyledTableCell align="center">Nome</StyledTableCell>
                                <StyledTableCell align="center">Ação</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody >
                            {
                                modelosEncontrados.map((row) => (
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
                                            {row.nome_marca}
                                        </StyledTableCell>
                                        <StyledTableCell align='center'>
                                            {row.nome}
                                        </StyledTableCell>
                                        <StyledTableCell align="center" >
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Button variant="contained" color="primary" size="small" endIcon={<EditIcon />}>

                                                                <Link style={{ textDecoration: "none", color: "white" }} to={`/ModeloEditarRegistro/${row.codigo}`}>Editar</Link>

                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button variant="contained" size="small" endIcon={<DeleteIcon />} color='error' onClick={() => AbrirModalExcluir(row)}>
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
                            Tem certeza que deseja excluir a Marca <b> [ {nome} ]</b>?
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