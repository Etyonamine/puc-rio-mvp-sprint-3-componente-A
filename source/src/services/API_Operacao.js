import axios from "axios";

const API_Operacao = axios.create({
  baseURL: `${import.meta.env.VITE_URL_API_OPERACAO}`,
});

export default API_Operacao;