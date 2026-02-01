import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../utils/authSlice";
import "./AuthPage.css";

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "" // now URL
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      dispatch(registerUser(formData)); // send JSON
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Sign In" : "Register"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                className="auth-input"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              {/* Avatar URL instead of file */}
              <input
                className="auth-input"
                type="text"
                name="avatar"
                placeholder="Avatar Image URL"
                value={formData.avatar}
                onChange={handleChange}
              />
            </>
          )}

          <input className="auth-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="auth-input" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <button className="auth-button" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
