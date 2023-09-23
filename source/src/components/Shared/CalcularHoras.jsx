export default function CalcularHoras(dataEntrada, dataSaida) {


    let dtEntrada = dataEntrada; // "20170620 11:20";
    let dtSaida = dataSaida; //"20170620 16:40";

    let date1 = new Date(dtEntrada.slice(0, 4), dtEntrada.slice(4, 6), dtEntrada.slice(6, 8), dtEntrada.slice(9, 11), dtEntrada.slice(12, 14)),
        date2 = new Date(dtSaida.slice(0, 4), dtSaida.slice(4, 6), dtSaida.slice(6, 8), dtSaida.slice(9, 11), dtSaida.slice(12, 14));

    let diffMs = (date2 - date1);
    let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    let diffMins = Math.round((diffMs % 86400000) % 3600000);
    return diffMs;//retorno em segundos

    
}
