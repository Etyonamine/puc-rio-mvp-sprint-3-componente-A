import React, { Component  } from 'react';
import API_Veiculo from '../../services/API_Veiculo';

export default class ListaMarcas extends Component {
    state = {
        marcas: []
    }
    componentDidMount() {
        API_Veiculo.get(`/marcas`)
            .then(res => {
                const marcas = res.data.lista;
                this.setState({ marcas });
            })
    }
    render() {
        return (
            <ul>
            {
                this.state.marcas
                    .map(tipo =>
                        <li key={tipo.codigo}>{tipo.nome}</li>
                    )
            }
            </ul>
        )
    }
}