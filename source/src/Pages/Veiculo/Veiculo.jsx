import React from "react";
import ListaVeiculos from "../../components/veiculos/ListaVeiculos";
import TituloPagina from '../../components/TituloPagina';

const Veiculo = () => {
    return (
        <div>
            <TituloPagina titulo = "Lista de Veículos"  />
            <ListaVeiculos />
        </div>
    );
};

export default Veiculo;