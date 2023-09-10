import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css';

//1-configurando router
import {  createBrowserRouter, RouterProvider, Navigate} from "react-router-dom";

import Home from "./routes/Home";
import Registro from "./routes/Registro";
import Veiculo from "./routes/Veiculo";
import TipoOperacao from './routes/tipoOperacao/TipoOperacao';
import TipoOperacaoEditar from "./components/tipoOperacao/TipoOperacaoFormEditar";
import ListaTipoOperacao from "./components/tipoOperacao/ListaTipoOperacao";

import ErrorPage from "./routes/ErrorPage";

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
          path: "ListaTipoOperacao",
          element: <ListaTipoOperacao /> 
        },
        {
          path: "TipoOperacaoEditar/:id",
          element: <TipoOperacaoEditar /> 
        },    
        {
          path: "Marca",
          element: <Veiculo /> 
        },
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
