import React, { useState, useEffect, forwardRef } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
    Box,
    Button,
    Container,
    FormControl,
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
import CalcularHoraTexto from '../../components/Shared/CalcularHoraTexto';
import CalcularHoras from '../../components/Shared/CalcularHoras';

const OperacaoSaida = () => {
    const { id } = useParams();
    const [veiculo, setVeiculo] = useState('');
    const [operacao, setOperacao] = useState('');
    
    const [dataSaida, setDataSaida] = React.useState(dayjs(new Date()));
    const [dataEntrada, setDataEntrada] = React.useState(null);
    const [dataEntradaBase, setDataEntradaBase] = React.useState(null);
    const [horasPermanencia, setHorasPermanencia] = useState('');
    const [valorTotalPagar, setValorTotalPagar]= useState(0);

    const [salvando, setSalvando] = useState(false);

    /** urls de serviços */
    const urlBaseOperacao = `${import.meta.env.VITE_URL_API_OPERACAO}`;
    const urlBaseVeiculo = `${import.meta.env.VITE_URL_API_VEICULO}`;

    useEffect(() => {
        getOperacao();
        
       
    }, []);
    

    useEffect(()=>{
        
        if(dataEntradaBase!= null){
            console.log(dataEntradaBase.toISOString());
            const newDate = (new Date(dataEntradaBase)).toISOString().slice(0,10).replace(/-/g,"") + ` ${new Date(dataEntradaBase).toTimeString().substring(0,5)}`
            console.log(newDate);
            const newDate2 = (new Date(dataSaida)).toISOString().slice(0,10).replace(/-/g,"") + ` ${new Date(dataSaida).toTimeString().substring(0,5)}`
            let horas = CalcularHoraTexto(newDate, newDate2) ;
            let segundosTotal = CalcularHoras(newDate, newDate2) ;
            setValorTotalPagar(calcularValor(segundosTotal));
            setHorasPermanencia(horas);
            console.log(valorTotalPagar);
            console.log(calcularValor(segundosTotal));
        }
    },[dataSaida, dataEntradaBase])

    const calcularValor = (valorTotalSegundos) =>{
        let valorSegundo = (10 / (60 * 1000));
        let valorCalculado = valorTotalSegundos * valorSegundo;

        return valorCalculado;
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

    /** salvando */
    const SalvarRegistro = ()=>{

    }

    
    return (
        <div>
            <Titulo titulo="Operação - Registro da Saída do Veículo" />
            <Box
                component="div"
            >
                <Container
                    component="div"
                    sx={{ backgroundColor: "beige" }}
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
            <Container

                sx={{ backgroundColor: "beige", height: 150, verticalAlign: 'center' }}
            >
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
                                style: { fontSize: 16, textAlign: 'left' , fontFamily: 'arial' },

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
                        sx={{ width: 300 , marginTop: 3.1}}
                    >
                        <TextField                            
                            id="outlined-read-only-input"
                            label="Permanência"
                            value={horasPermanencia}
                            inputProps={{
                                maxLength: 7,
                                style: { textTransform: "uppercase", fontSize: 14 },
                                readOnly: true,
                            }}
                        />
                    </FormControl>
                

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

        </div>
    );
}
export default OperacaoSaida