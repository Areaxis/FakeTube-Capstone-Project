import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideos } from "../utils/videoSlice";
import { useParams } from "react-router-dom";
import CategoryBar from "../components/CategoryBar";
import VideoCard from "../components/VideoCard";
import "./HomePage.css";

const HomePage = () => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);

  // URL params
  const { name, query } = useParams();

  // Fetch videos when filters change
  useEffect(() => {
    dispatch(fetchVideos({ category: name || "", search: query || "" }));
  }, [dispatch, name, query]);

  const showEmpty = !loading && videos.length === 0;
  const showLoading = loading && videos.length === 0;

  return (
    <div className="home">

      {/* ✅ ALWAYS visible filter bar */}
      <CategoryBar />

      {/* Loading state */}
      {showLoading && <h3>Loading videos...</h3>}

      {/* Empty state */}
      {showEmpty && (
        <div className="empty-message">
          Sorry, there are no videos available at the moment
          <img
            className="empty-img"
            src="https://media.tenor.com/nBGt8234rsoAAAAj/detective-investigating.gif"
            alt="no videos"
          />
        </div>
      )}

      {/* Video grid */}
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

    </div>
  );
};

export default HomePage;
