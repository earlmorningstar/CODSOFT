import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleHomepage = () => {
    navigate("/homepage");
  };

  return (
    <section className="errorPage-main-container">
      <span>
        <p>Oops!!</p>
        <p>This page you're looking for isn't avaiable.</p>
        <p>Let's get you back to shopping the latest trends!</p>
      </span>
      <button onClick={handleHomepage}>Homepage</button>
    </section>
  );
};

export default ErrorPage;
