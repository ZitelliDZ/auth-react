import axios from "axios";

export const messageError = (error:unknown)  => {
  const message = "Error en el servicio, por favor intente más tarde";
  const success = false;
  if (axios.isAxiosError(error)) {
    // Manejo específico de errores de Axios
    console.error("Error: ", error.response?.data.message || error.message);
  } else if (error instanceof Error) {
    // Manejo general de errores
    console.error("Error: ", error.message);
  } else {
    // Error desconocido, convierte a string para manejarlo

    console.error("Error: ", message);
  }
  return {
    success,
    message,
  };
};
