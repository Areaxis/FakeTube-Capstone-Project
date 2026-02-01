import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    isActive(path) ? "sidebar-item active" : "sidebar-item";

  return (
    <aside className="yt-sidebar">
      {/* MAIN */}
      <ul>
        <li>
          <Link to="/" className={linkClass("/")}>
            <span className="material-icons-outlined">home</span>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/shorts" className={linkClass("/shorts")}>
            <span className="material-icons-outlined">smart_display</span>
            <span>Shorts</span>
          </Link>
        </li>
        <li>
          <Link to="/subscriptions" className={linkClass("/subscriptions")}>
            <span className="material-icons-outlined">subscriptions</span>
            <span>Subscriptions</span>
          </Link>
        </li>
      </ul>

      <hr />

      {/* YOU SECTION */}
      <ul>
        <li>
          <Link to="/you" className={linkClass("/you")}>
            <span className="material-icons-outlined">account_circle</span>
            <span>You</span>
          </Link>
        </li>
        <li>
          <Link to="/history" className={linkClass("/history")}>
            <span className="material-icons-outlined">history</span>
            <span>History</span>
          </Link>
        </li>
      </ul>

      <hr />

      {/* EXPLORE */}
      <h4 className="sidebar-title">Explore</h4>
      <ul>
        <li><Link><span className="material-icons-outlined">shopping_bag</span><span>Shopping</span></Link></li>
        <li><Link><span className="material-icons-outlined">music_note</span><span>Music</span></Link></li>
        <li><Link><span className="material-icons-outlined">movie</span><span>Movies</span></Link></li>
        <li><Link><span className="material-icons-outlined">live_tv</span><span>Live</span></Link></li>
        <li><Link><span className="material-icons-outlined">sports_esports</span><span>Gaming</span></Link></li>
        <li><Link><span className="material-icons-outlined">article</span><span>News</span></Link></li>
        <li><Link><span className="material-icons-outlined">emoji_events</span><span>Sports</span></Link></li>
        <li><Link><span className="material-icons-outlined">school</span><span>Courses</span></Link></li>
        <li><Link><span className="material-icons-outlined">checkroom</span><span>Fashion & Beauty</span></Link></li>
        <li><Link><span className="material-icons-outlined">podcasts</span><span>Podcasts</span></Link></li>
      </ul>

      <hr />

      {/* MY INFO */}
      <ul>
        <li>
          <a
            href="https://github.com/Areaxis"
            target="_blank"
            rel="noreferrer"
            className="sidebar-item"
          >
            <span className="material-icons-outlined">info</span>
            Khriesezo Peseyie
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
