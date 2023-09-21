import React, { useState, useEffect, forwardRef } from 'react'
import TituloPagina from '../../components/TituloPagina';
import BotaoVoltar from '../../components/Botoes/BotaoRetornar';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
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
    const [tipos, setTipos] = useState([]);
    const [codigoTipo, setCodigoTipo] = useState(0);

    const urlBaseOperacao = `${import.meta.env.VITE_URL_API_OPERACAO}`;

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
    const HandleTipo = (event) =>{
        setCodigoTipo(event.target.value);
    }
    const SalvarRegistro = () => {

    }

    return (
        <div>
            <TituloPagina titulo="Operação - Nova entrada no estacionamento" />
            <br />
            <Box
                component='div'
                fullWidth
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
                    onChange={e => setPlaca(e.target.value)}
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
                        sx={{width:150, textAlign:'center'}}
                    >
                        <DateTimeField
                            label="Data-Entrada"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            inputProps={{
                                style: { fontSize: 14 , textAlign:'left' },
                            }}
                        />
                    </FormControl>
                    
                </LocalizationProvider>

                &nbsp;
                {/* Tipo ***************************************************** */}

                <FormControl
                    sx={{width:560 , textAlign:'center'}}
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
                        onChange ={HandleTipo}
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
            <Box
                component='div'
                sx={{

                    '& .MuiTextField-root': { width: '600' },

                }}
                noValidate
                autoComplete="off"
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
                    fullWidth
                />

            </Box>
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
                <BotaoVoltar disabled={disabled} />
            </Box>

        </div>
    );
}

export default OperacaoFormulario;