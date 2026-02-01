import { Link } from "react-router-dom";
import "./ErrorPage.css";

// 404 Page
const ErrorPage = () => {
  return (
    <div className="error-page">
      <img
        src="https://media.tenor.com/XJxuWmW3ragAAAAj/confused-cute-puppy.gif"
        alt="confused puppy"
        className="error-gif"
      />
      <h1>404</h1>
      <h2>Oops! Page not found.</h2>
      <p>The page you’re looking for doesn’t exist or was moved.</p>

      <Link to="/" className="home-btn">
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
