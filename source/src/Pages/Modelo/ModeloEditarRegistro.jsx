import React, { useState,useEffect } from 'react';
import TituloPagina from '../../components/TituloPagina';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select ,
    TextField        
} from '@mui/material';
import BotaoRetornar from '../../components/Botoes/BotaoRetornar';




const ModeloEditarRegistro = () => {
    const [nome, setNome] = useState('');
    
    const [codigoMarca, setCodigoMarca] = React.useState('');
    const [marcasEncontradas, setListaMarcas] = useState([]);

    const handleChange = (event) => {
        setCodigoMarca(event.target.value);
    };
    useEffect(()=>{
        ListaMarcas()
    },[]);

    const ListaMarcas = () => {
        fetch(`${import.meta.env.VITE_URL_API_VEICULO}/marcas`)
            .then(response => response.json())
            .then(responseData => {
                setListaMarcas(responseData.lista);

            })
            .catch(error => {
                if (error.message === "Failed to fetch")
                {
                     // get error message from body or default to response status                    
                     alert('A comunicação com os serviços de Marcas de Veículos está com problemas!');
                     return Promise.reject(error);
                }                 
            });
    }

    return (

        <div>


            <div>
                <TituloPagina titulo="Cadastro de Modelo de Veículo - Editar registro" />
            </div>
            <br/>
            <div>
                <FormControl sx={{minWidth:300}}  noValidate
                    autoComplete="off">
                    
                    <InputLabel id="lblSelectMarca">Marca</InputLabel>
                    <Select

                        labelId="lblSelectMarca"
                        id="marcas_select"
                        value={codigoMarca}
                        label="Marca"
                        onChange={handleChange}
                    >
                        {
                            marcasEncontradas.map((row)=> (
                                <MenuItem value={row.codigo} key = {row.codigo} >{row.nome}</MenuItem>
                            ))
                        }
                    </Select>
                    
                </FormControl>
             &nbsp;
            <FormControl  
                    sx={{ minWidth:400}}
                    noValidate
                    autoComplete="off" >
                <TextField
                            required
                            id="outlined-required"
                            label="Nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />
            </FormControl>
                
            </div>
            <br />
            <div>
            <BotaoRetornar />
            </div>
            







        </div>
    )
}
export default ModeloEditarRegistro;