import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./CategoryBar.css";

/* Category buttons for filtering */
const categories = ["All", "Learning", "Gaming", "Music", "Education", "Sports", "Movies", "News", "Fashion"];

const CategoryBar = () => {
  const navigate = useNavigate();
  const { name } = useParams();        // category from URL
  const location = useLocation();     // detect home route

  // If on "/" → active is "All", otherwise active is category name
  const activeCategory = location.pathname === "/" ? "All" : name;

  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() =>
            cat === "All" ? navigate("/") : navigate(`/category/${cat}`)
          }
          className={`pill ${activeCategory === cat ? "active-pill" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
