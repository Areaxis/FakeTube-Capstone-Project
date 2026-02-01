import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { media } from "../utils/helper";
import "./ChannelDashboard.css";

/* Built-in categories (same as homepage filter) */
const CATEGORIES = ["Gaming", "Music", "Learning", "News", "Sports", "Movies", "Fashion"];

const ChannelDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // ================= STATE =================
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Channel creation form data
  const [channelData, setChannelData] = useState({
    channelName: "",
    description: "",
    avatarFile: null,
    bannerFile: null
  });

  // Video upload form data
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    category: "",
    videoFile: null,
    thumbnailFile: null
  });

  // ================= FETCH USER CHANNELS =================
  useEffect(() => {
    if (user) fetchMyChannels();
  }, [user]);

  // ================= FETCH VIDEOS OF SELECTED CHANNEL =================
  useEffect(() => {
    if (selectedChannel) fetchMyVideos(selectedChannel._id);
  }, [selectedChannel]);

  const fetchMyChannels = async () => {
    const res = await api.get("/my-channels");
    setChannels(res.data);
  };

  const fetchMyVideos = async (channelId) => {
    const res = await api.get(`/videos?channel=${channelId}`);
    setVideos(res.data);
  };

  // ================= CREATE CHANNEL =================
  const handleChannelSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("channelName", channelData.channelName);
    formData.append("description", channelData.description);

    if (channelData.avatarFile) formData.append("avatar", channelData.avatarFile);
    if (channelData.bannerFile) formData.append("banner", channelData.bannerFile);

    await api.post("/channels", formData);

    setChannelData({ channelName: "", description: "", avatarFile: null, bannerFile: null });
    setShowChannelForm(false);
    fetchMyChannels();
  };

  // ================= UPLOAD OR UPDATE VIDEO =================
  const handleVideoSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    formData.append("category", videoData.category);
    formData.append("channel", selectedChannel._id);

    if (videoData.videoFile) formData.append("video", videoData.videoFile);
    if (videoData.thumbnailFile) formData.append("thumbnail", videoData.thumbnailFile);

    if (editingVideo) {
      await api.put(`/videos/${editingVideo._id}`, formData);
    } else {
      await api.post("/videos", formData);
    }

    setVideoData({ title: "", description: "", category: "", videoFile: null, thumbnailFile: null });
    setEditingVideo(null);
    setShowVideoForm(false);
    fetchMyVideos(selectedChannel._id);
  };

  // ================= EDIT VIDEO =================
  const handleEdit = (video) => {
    setEditingVideo(video);
    setVideoData({
      title: video.title,
      description: video.description,
      category: video.category,
      videoFile: null,
      thumbnailFile: null
    });
    setShowVideoForm(true);
  };

  // ================= DELETE VIDEO =================
  const handleDelete = async (videoId) => {
    if (window.confirm("Delete this video?")) {
      await api.delete(`/videos/${videoId}`);
      fetchMyVideos(selectedChannel._id);
    }
  };

  if (!user) return <div className="dashboard-error">You must be logged in</div>;

  return (
    <div className="channel-dashboard">
      <h1 className="dashboard-title">Channel Dashboard</h1>

      {/* ================= CHANNEL LIST ================= */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title">
          Your Channels <span className="dashboard-section-info">(Click the channel icon for details)</span>
        </h2>

        <div className="dashboard-channel-list">
          {channels.map((ch) => (
            <div
              key={ch._id}
              className={`dashboard-channel-card ${selectedChannel?._id === ch._id ? "dashboard-channel-active" : ""}`}
              onClick={() => setSelectedChannel(ch)}
            >
              <img src={media(ch.avatar)} alt="" className="dashboard-channel-avatar" />
              <span className="dashboard-channel-name">{ch.channelName}</span>
            </div>
          ))}
        </div>

        <button className="dashboard-primary-btn" onClick={() => setShowChannelForm(!showChannelForm)}>
          + Create Channel
        </button>

        {/* Channel creation form */}
        {showChannelForm && (
          <form onSubmit={handleChannelSubmit} className="dashboard-form">
            <label>Channel Name</label>
            <input className="dashboard-input" value={channelData.channelName} onChange={e => setChannelData({ ...channelData, channelName: e.target.value })} required />

            <label>Description</label>
            <textarea
              className="dashboard-input"
              rows={3}
              value={channelData.description}
              onChange={e => setChannelData({ ...channelData, description: e.target.value })}
            />

            <label>Channel Avatar</label>
            <input className="dashboard-input" type="file" accept="image/*" onChange={e => setChannelData({ ...channelData, avatarFile: e.target.files[0] })} required />

            <label>Channel Banner</label>
            <input className="dashboard-input" type="file" accept="image/*" onChange={e => setChannelData({ ...channelData, bannerFile: e.target.files[0] })} required />

            <div className="dashboard-form-actions">
              <button className="dashboard-primary-btn" type="submit">Save Channel</button>
              <button type="button" className="dashboard-secondary-btn" onClick={() => setShowChannelForm(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* ================= VIDEO MANAGEMENT ================= */}
      {selectedChannel && (
        <>
          <div className="dashboard-card">
            <h2 className="dashboard-section-title">Managing: {selectedChannel.channelName}</h2>

            <button
              className="dashboard-primary-btn"
              onClick={() => {
                setEditingVideo(null);
                setVideoData({ title: "", description: "", category: "", videoFile: null, thumbnailFile: null });
                setShowVideoForm(!showVideoForm);
              }}
            >
              Upload Video
            </button>

            {/* Video upload / edit form */}
            {showVideoForm && (
              <form onSubmit={handleVideoSubmit} className="dashboard-form">
                <label>Video Title</label>
                <input className="dashboard-input" value={videoData.title} onChange={e => setVideoData({ ...videoData, title: e.target.value })} required />

                <label>Description</label>
                <textarea
                  className="dashboard-input"
                  rows={4}
                  value={videoData.description}
                  onChange={e => setVideoData({ ...videoData, description: e.target.value })}
                />

                <label>Category</label>
                <select
                  className="dashboard-input"
                  value={videoData.category}
                  onChange={e => setVideoData({ ...videoData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <label>Video File</label>
                <input className="dashboard-input" type="file" accept="video/mp4" onChange={e => setVideoData({ ...videoData, videoFile: e.target.files[0] })} required={!editingVideo} />

                <label>Thumbnail Image</label>
                <input className="dashboard-input" type="file" accept="image/*" onChange={e => setVideoData({ ...videoData, thumbnailFile: e.target.files[0] })} />

                <div className="dashboard-form-actions">
                  <button className="dashboard-primary-btn" type="submit">
                    {editingVideo ? "Update Video" : "Upload Video"}
                  </button>
                  <button type="button" className="dashboard-secondary-btn" onClick={() => setShowVideoForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Video list */}
          <div className="dashboard-card">
            <h3 className="dashboard-subtitle">Your Videos</h3>
            <div className="dashboard-video-grid">
              {videos.map((v) => (
                <div key={v._id} className="dashboard-video-card">
                  <img src={media(v.thumbnailUrl)} alt="" className="dashboard-video-thumb" />
                  <p className="dashboard-video-title">{v.title}</p>

                  <div className="dashboard-video-actions">
                    <button onClick={() => handleEdit(v)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(v._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelDashboard;
