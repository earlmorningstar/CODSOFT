import { createRoot } from "react-dom/client";
import axios from "axios";
import SessionExpiredModal from "../pages/SessionExpiredModal";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let showModal = false;

const displayModal = () => {
  if (!showModal) {
    showModal = true;
    const modalDiv = document.createElement("div");
    document.body.appendChild(modalDiv);

    const handleClose = () => {
      showModal = false;
      localStorage.removeItem("user");
      const root = createRoot(modalDiv);
      root.unmount();
      document.body.removeChild(modalDiv);
    };
    const root = createRoot(modalDiv);
    root.render(<SessionExpiredModal open={true} onClose={handleClose} />);
  }
};

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  } else {
    console.warn("No token found in localStorage");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      displayModal();
    }
    return Promise.reject(error);
  }
);

export default api;
