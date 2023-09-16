import React, { useState } from 'react';
import TituloPagina from '../../components/TituloPagina';
import MarcaSalvarNovoRegistro from '../../components/marcas/MarcaSalvarNovoRegistro';
import {
    Box,
    TextField
} from '@mui/material';

const MarcaNovoRegistro = () => {
    const [nome, setNome] = useState('');
    
    return (

        <div>
            <Box
                componet="div"
            >
                <TituloPagina titulo="Cadastro de Marca - Novo registro" />
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
            <MarcaSalvarNovoRegistro nome={nome}/>
            
        </div>
    )
}
export default MarcaNovoRegistro;