import { createRoot } from "react-dom/client";
import axios from "axios";
import SessionModalPortal from "../components/SessionModalPortal";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // withCredentials: true,
});

let showModal = false;
let modalContainer = null;
let modalRoot;

const displayModal = () => {
  if (!showModal) {
    showModal = true;
    modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);

    const handleClose = () => {
      showModal = false;
      if (modalRoot) {
        modalRoot.unmount();
      }

      if (modalContainer && modalContainer.parentNode) {
        modalContainer.parentNode.removeChild(modalContainer);
      }

      modalContainer = null;
      modalRoot = null;
    };

    modalRoot = createRoot(modalContainer);
    modalRoot.render(<SessionModalPortal onClose={handleClose} />);
   
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
    if (error.response?.status === 401 && error.response?.data?.isAuthError) {
      // localStorage.renoveItem("user");
      // window.location.href = "/login";

      displayModal();
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
