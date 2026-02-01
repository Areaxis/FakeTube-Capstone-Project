import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../utils/authSlice";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Search input state
  const [query, setQuery] = useState("");

  // Trigger search navigation
  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search/${query}`);
  };

  return (
    <header className="yt-header">
      <div className="yt-header-left">
        <button className="menu-btn" onClick={toggleSidebar}>☰</button>
        <Link to="/" className="logo">
          <span className="logo-red">▶</span> Fake <span className="logo-name">Tube</span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="yt-header-center">
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          <span className="material-icons-outlined">search</span>
        </button>
      </div>

      {/* RIGHT SIDE USER AREA */}
      <div className="yt-header-right">
        {!user ? (
          <Link to="/auth" className="signin-btn">Sign in</Link>
        ) : (
          <>
            <Link to="/auth/channel" className="user-info">
              <span className="username">{user.username}</span>
              <img className="useravatar" src={user.avatar} alt="avatar" />
            </Link>

            <button onClick={() => dispatch(logout())} className="signin-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
