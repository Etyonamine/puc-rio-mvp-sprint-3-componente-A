export default function AdicionarOuReduzirDataPorHora(data_hora, quantidade_horas)
{
    let dataRetorno = new Date(data_hora);
    return dataRetorno.setHours(dataRetorno.getHours() + quantidade_horas);
    
}