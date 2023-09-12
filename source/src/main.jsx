import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css';

//1-configurando router
import {  createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";


import Home from "./Pages/Home";
import Registro from "./Pages/Registro";
import Veiculo from "./Pages/Veiculo";
import Marca from './Pages/Marca/Marca';
import MarcaNovoRegistro from './components/marcas/MarcaSalvarNovoRegistro';
import TipoOperacao from './Pages/tipoOperacao/TipoOperacao';
import TipoOperacaoNovoRegistro from './Pages/tipoOperacao/TipoOperacaoNovoRegistro';
import TipoOperacaoEditar from "./components/tipoOperacao/TipoOperacaoFormEditar";
import ListaTipoOperacao from "./components/tipoOperacao/ListaTipoOperacao";


import ErrorPage from "./Pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <App />,
    children:[
      
        {
          path: "/",
          element: <Home />
        },              
        {
          path: "Registro",
          element: <Registro /> 
        },
        {
          path: "Veiculo",
          element: <Veiculo /> 
        },        
        {
          path: "TipoOperacao",
          element: <TipoOperacao /> 
        },
        {
          path: "TipoOperacaoNovo",
          element: <TipoOperacaoNovoRegistro />
        },
        {
          path: "ListaTipoOperacao",
          element: <ListaTipoOperacao /> 
        },
        {
          path: "TipoOperacaoEditar/:id",
          element: <TipoOperacaoEditar /> 
        },    
        {
          path: "Marca",
          element: <Marca /> 
        },
        {
          path: "MarcaNovoRegistro",
          element: <MarcaNovoRegistro />
        },        
       /*  {
          path: "MarcaFormulario",
          element: <MarcaFormulario /> 
        }, */
        {
          path: "Modelo",
          element: <Veiculo /> 
        },
        {
          path : "oldcontact",
          element: <Navigate to="/contact" />,
        }
    ],
  }
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>
);
