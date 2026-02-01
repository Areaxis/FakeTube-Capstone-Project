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
    avatar: null // 🔥 now stores FILE not string
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Handle text fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);

      if (formData.avatar) {
        data.append("avatar", formData.avatar); // 🔥 send file
      }

      dispatch(registerUser(data));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Sign In" : "Register"}</h2>

        <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
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

              {/* Avatar File Upload */}
              <label>Avatar Image</label>
              <input
                className="auth-input"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
              />
            </>
          )}

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="auth-button" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Sign In"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
