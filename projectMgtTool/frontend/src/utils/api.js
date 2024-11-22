import axios from "axios";
import ReactDOM from "react-dom";
import SessionExpiredModal from "../pages/SessionExpiredModal";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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
      ReactDOM.unmountComponentAtNode(modalDiv);
      document.body.removeChild(modalDiv);
    };
    ReactDOM.render(
      <SessionExpiredModal open={true} onClose={handleClose} />,
      modalDiv
    );
  }
};

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
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
