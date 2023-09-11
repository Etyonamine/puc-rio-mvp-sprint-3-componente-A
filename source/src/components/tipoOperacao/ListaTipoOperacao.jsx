import * as React from 'react';
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
import { Component } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DialogExcluirTipoOperacao from '../../components/tipoOperacao/DialogExcluirTipoOperacao';

export default class ListaTipoOperacao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lista: [],
        };
    }
    componentDidMount() {
        fetch(`${import.meta.env.VITE_URL_API_OPERACAO}/tipo_operacoes`)
            .then(response => response.json())
            .then(responseData => this.setState(responseData))
            .catch(error => console.error(error));
    }
    render() {

        if (this.state.loading) {
            return <p>Carregando...</p>;
        }
        else {

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

            return (
                <div>
                    <Box
                        component="div"
                        sx={{
                            height:40,                            
                            width: '100%',
                            marginTop: 1,
                            marginBottom:1
                        }}
                    >
                        <Stack direction="row">
                            <Button variant="contained" color="primary">
                                <Link style={{ textDecoration: "none", color: "white" }} to={`/TipoOperacaoNovo`}>Novo registro</Link>
                            </Button>
                        </Stack>
                        
                    </Box>
                    <Box
                     component="div"
                    >
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="lista">
                                <TableHead sx={{ height: 40 }}>
                                    <TableRow>
                                        <StyledTableCell align="center">Código</StyledTableCell>
                                        <StyledTableCell align="center">Sigla</StyledTableCell>
                                        <StyledTableCell align="center">Descrição</StyledTableCell>
                                        <StyledTableCell align="center">Ação</StyledTableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody >

                                    {this.state
                                        .lista.map((row) => (
                                            <StyledTableRow
                                                key={row.codigo}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 40 }}
                                            >
                                                <StyledTableCell align='center' component="th" scope="row" divider={<Divider orientation="vertical" flexItem />}>
                                                    {row.codigo}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {row.sigla}
                                                </StyledTableCell>
                                                <StyledTableCell align='center'>
                                                    {row.descricao}
                                                </StyledTableCell>
                                                <StyledTableCell align="center" >
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <Button variant="contained" color="primary" size="small" endIcon={<EditIcon />}>
                                                                        <Link style={{ textDecoration: "none", color: "white" }} to={`/TipoOperacaoEditar/${row.codigo}`}>Editar</Link>
                                                                    </Button>
                                                                </td>
                                                                <td>
                                                                    <DialogExcluirTipoOperacao tipoOperacaoParam={row} />
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

                </div>
            )
        }
    }
}