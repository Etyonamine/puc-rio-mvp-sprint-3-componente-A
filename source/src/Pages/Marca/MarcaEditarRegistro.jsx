import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TituloPagina from '../../components/TituloPagina';

import MarcaSalvarEdicaoRegistro from '../../components/marcas/MarcaSalvarEdicaoRegistro';
import {
    Box,
    TextField
} from '@mui/material';


const MarcaEditarRegistro = (props) => {
    const [nome, setNome] = useState('');
    const { id } = useParams();

    useEffect(() => {
        let url = `${import.meta.env.VITE_URL_API_VEICULO}/marca_id?codigo=${id}`;


        fetch(url)
            .then(response => response.json())
            .then(responseData => {                
                setNome(responseData.nome);                
            })
            .catch(error => console.error(error));
    }, []);

    return (

        <div>
            <Box
                componet="div"
            >
                <TituloPagina titulo="Cadastro de Marca - Editar registro" />
            </Box>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    textAlign: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    id="outlined-required"
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

            </Box>
            <MarcaSalvarEdicaoRegistro nome={nome} codigo={id} />
           
        </div>
    )
}
export default MarcaEditarRegistro;