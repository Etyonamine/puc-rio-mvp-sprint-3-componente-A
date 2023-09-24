export default function FormatarData(data)
{    
    let dataParam = new Date(data).toLocaleString().replace(",","");
    let horaParam = new Date(data).toTimeString();
    let retorno = `${dataParam.substring(6,10)}-${dataParam.substring(3,5)}-${dataParam.substring(0,2)}`;
    return retorno;    
}