import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';
import {
    Box,
    Button,
    FormControl,
    TextField
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'
import SaveIcon from '@mui/icons-material/Save';

const OperacaoFormulario = () => {
    const [disabled, setDisabled] = useState(false);
    const [placa, setPlaca] = useState('');
    const [observacao, setObservacao] = useState('');
    const [value, setValue] = React.useState(dayjs(new Date()));
    const [novoRegistro, setNovoRegistro] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const SalvarRegistro = ()=>{

    }

    return (
        <div>
            <TituloPagina titulo="Operação - Nova entrada no estacionamento" />
            <br />
            <Box
                component='div'
            >
            <FormControl sx={{ minWidth: 200 }} noValidate
                autoComplete="off">
                <TextField
                    required
                    id="outlined-helperText"
                    label="Placa"
                    labelrequired="*"
                    value={placa}
                    onChange={e => setPlaca(e.target.value)}
                    inputProps={{
                        maxLength: 7,
                        style: { textTransform: "uppercase", fontSize: 11 },
                    }}
                    helperText="Digite a placa sem o traço separador"
                />
            </FormControl>
            &nbsp;
            <FormControl
                sx={{ fontSize: 12 }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}
                    adapterLocale="pt-br">
                    <DateTimeField
                        sx={{ fontSize: 11}}
                        label="Data-Entrada"
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </LocalizationProvider>
            </FormControl>
            </Box>
            <br/>
            <Box
                component='div'
            >
                <FormControl
                    sx={{

                        '& .MuiTextField-root': { minWidth: 450},
                    }}
                    noValidate
                    autoComplete="off">
                    <TextField
                        id="outlined-helperText"
                        label="Observação"
                        labelrequired="*"
                        value={observacao}
                        onChange={e => setObservacao(e.target.value)}
                        inputProps={{
                            maxLength: 7,                            
                            style: { textTransform: "uppercase", fontSize:11 },
                            
                        }}
                    />
                </FormControl>
            </Box>
            <br/>            
         
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
                <BotaoVoltar disabled={disabled} />
            </Box>

        </div>
    );
}

export default OperacaoFormulario;