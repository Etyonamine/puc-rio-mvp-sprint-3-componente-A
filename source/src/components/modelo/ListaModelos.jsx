import React, { useEffect, useState } from 'react';
import {
  Box
  } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
const columns = [
  {
    field: 'codigo',
    headerName: 'codigo',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center',
    flex: 0.3,
    minWidth: 50,
    width: 70
  },
  /* {field: 'marca', headerName: 'Marca', width:130}, */
  {
    field: 'nome_marca', headerName: 'Marca', headerClassName: 'super-app-theme--header',
    headerAlign: 'center', width: 300
  },
  {
    field: 'nome', headerName: 'Nome', headerClassName: 'super-app-theme--header',
    headerAlign: 'center', width: 300

  },
];

export default function ListaModelos() {
  const [modelosEncontrados, setListaModelos] = useState([]);  
 
  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL_API_VEICULO}/modelos`,{ mode: 'no-cors' })
      .then(response => response.json())
      .then(responseData => setListaModelos(responseData.lista))
      .catch(error => {       
        if (error.message === "Failed to fetch")
                {
                     // get error message from body or default to response status                    
                     alert('A comunicação com o serviço de consulta de Modelo de Veículos está com problemas!');
                      
                }     
      });

  }, []);
  const localizedTextsMap = {
    columnMenuUnsort: "não classificado",
    columnMenuSortAsc: "Classificar por ordem crescente",
    columnMenuSortDesc: "Classificar por ordem decrescente",
    columnMenuFilter: "Filtro",
    columnMenuHideColumn: "Ocultar",
    columnMenuShowColumns: "Mostrar colunas"
  };


  return (

    <div style={{ height: 400, width: '100%' }}>
      <Box
        sx={{
          height: 300,
          width: '100%',
          '& .super-app-theme--header': {
            backgroundColor: 'rgba(255, 7, 0, 0.55)',
          },
        }}
      >
          
        
        <DataGrid
          sx={{ m: 2 }}
          rows={modelosEncontrados}
          getRowId={(row) => row.codigo}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },            
          }}          
          pageSizeOptions={[5, 10]}
          checkboxSelection
          localeText={localizedTextsMap}
          
        />
     
      </Box>      
            
    </div>

  );
}