import axios from "axios";

const API_Veiculo = axios.create({
  baseURL: `${import.meta.env.VITE_URL_API_VEICULO}`,
});

export default API_Veiculo;