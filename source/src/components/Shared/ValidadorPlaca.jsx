
/** tratamento do campo placa */
const ValidaPlaca = (valor) => {
    let regra = new RegExp(/^[a-zA-Z]{3}[0-9][A-Za-z0-9][0-9]{2}$/);
    return regra.test(valor);
};

export default ValidaPlaca;