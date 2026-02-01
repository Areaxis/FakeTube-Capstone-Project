import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideoById,
  fetchVideos,
  likeVideo,
  dislikeVideo
} from "../utils/videoSlice";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment
} from "../utils/commentSlice";
import "./VideoPage.css";

const VideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentVideo, videos } = useSelector((state) => state.videos);
  const { comments } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const userId = user?._id || user?.id;

  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  /* ================= LOAD VIDEO + COMMENTS ================= */
  useEffect(() => {
    dispatch(fetchVideoById(id));
    dispatch(fetchVideos({}));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  if (!currentVideo) return <h2>Loading...</h2>;

  const recommended = videos.filter(v => v._id !== id).slice(0, 10);

  /* ================= COMMENT SUBMIT ================= */
  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    if (editingId) {
      await dispatch(updateComment({ id: editingId, text: commentText }));
      setEditingId(null);
    } else {
      await dispatch(addComment({ videoId: id, text: commentText }));
    }

    setCommentText("");
    dispatch(fetchComments(id)); // reload populated comments
  };

  /* ================= SHARE LINK ================= */
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= FAKE SUB COUNT ================= */
  const randomSubs = () => {
    const num = Math.floor(Math.random() * 90 + 10);
    return `${num}.${Math.floor(Math.random() * 9)}M subscribers`;
  };

  return (
    <div className="video-page-wrapper">
      <div className="video-main">

        <video className="video-player" src={currentVideo.videoUrl} controls />

        <h1 className="video-title">{currentVideo.title}</h1>

        <div className="video-top-bar">
          <div className="channel-left">
            <Link to={`/channel/${currentVideo.channel?._id}`} className="video-channel-row">
              <img src={currentVideo.channel?.avatar} className="video-channel-avatar" alt="" />
              <div className="video-channel-text">
                <span className="video-channel-name">
                  {currentVideo.channel?.channelName}
                </span>
                <p className="video-subs">{randomSubs()}</p>
              </div>
            </Link>

            <button
              className={subscribed ? "subscribed-btn" : "subscribe-btn"}
              onClick={() => setSubscribed(!subscribed)}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="video-buttons">
            <button onClick={() => dispatch(likeVideo(currentVideo._id))}>
              <span className="material-icons-outlined">thumb_up</span>
              {currentVideo.likes?.length || 0}
            </button>

            <button onClick={() => dispatch(dislikeVideo(currentVideo._id))}>
              <span className="material-icons-outlined">thumb_down</span>
              {currentVideo.dislikes?.length || 0}
            </button>

            <button onClick={handleShare}>
              <span className="material-icons-outlined">share</span>
              Share
            </button>

            <a href={currentVideo.videoPath} download className="download-btn">
              <span className="material-icons-outlined">download</span>
              Download
            </a>
          </div>
        </div>

        {copied && <div className="copy-popup">Link copied!</div>}

        {/* DESCRIPTION */}
        <div className={`video-description-box ${showFullDesc ? "expanded" : ""}`}>
          <p className="video-description-text">
            {showFullDesc
              ? currentVideo.description
              : currentVideo.description.slice(0, 150) +
                (currentVideo.description.length > 150 ? "..." : "")}
          </p>

          {currentVideo.description.length > 150 && (
            <button className="show-more-btn" onClick={() => setShowFullDesc(!showFullDesc)}>
              {showFullDesc ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* COMMENTS */}
        <div className="comments-section">
          <h3>{comments.length} Comments</h3>

          {user ? (
            <div className="comment-input">
              <textarea
                className="comment-textarea"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                rows={1}
              />
              <div className="comment-actions-row">
                <button onClick={handleSubmit}>
                  {editingId ? "Update" : "Comment"}
                </button>

                {editingId && (
                  <button
                    className="cancel-edit-btn"
                    onClick={() => {
                      setEditingId(null);
                      setCommentText("");
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="login-warning">Sign in to comment</p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="comment">
              <img src={c.user?.avatar} className="comment-avatar" alt="" />
              <div className="comment-body">
                <strong>{c.user?.username}</strong>
                <p>{c.text}</p>

                {userId === c.user?._id && (
                  <div className="comment-actions">
                    <button onClick={() => {
                      setEditingId(c._id);
                      setCommentText(c.text);
                    }}>
                      Edit
                    </button>
                    <button onClick={async () => {
                      await dispatch(deleteComment(c._id));
                      dispatch(fetchComments(id));
                    }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="video-recommendations">
        <h2>Recommendations</h2>
        {recommended.map(video => (
          <Link to={`/watch/${video._id}`} key={video._id} className="recommend-card">
            <img src={video.thumbnailUrl} alt={video.title} className="recommend-thumb" />
            <div className="recommend-info">
              <p className="recommend-title">{video.title}</p>
              <p className="recommend-channel">{video.channel?.channelName}</p>
              <p className="recommend-views">{video.views || 0} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
