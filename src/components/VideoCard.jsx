// Import Link for navigation to video watch page
import { Link } from "react-router-dom";

// Helper function to build full media URLs from backend paths
import { media } from "../utils/helper";

// Component styles
import "./VideoCard.css";

// VideoCard component receives a video object as prop
const VideoCard = ({ video }) => {
  return (
    // Clicking the card navigates to the watch page of that video
    <Link to={`/watch/${video._id}`} className="video-card">
      
      // Video thumbnail image
      <img
        src={media(video.thumbnailUrl)}
        alt={video.title}
        className="thumbnail"
      />

      <div className="video-meta">
        
        // Channel avatar image
        <img
          src={media(video.channel?.avatar)}
          alt="channel avatar"
          className="channel-avatar"
        />

        <div className="video-text">
          // Video title
          <h4 className="video-title">{video.title}</h4>

          // Channel name
          <p className="channel-name">{video.channel?.channelName}</p>

          // View count, default to 0 if not available
          <p className="views">{video.views || 0} views</p>
        </div>
      </div>
    </Link>
  );
};

// Export component for use in other pages
export default VideoCard;
