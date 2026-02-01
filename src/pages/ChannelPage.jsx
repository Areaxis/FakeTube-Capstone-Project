import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { media } from "../utils/helper";
import "./ChannelPage.css";

const ChannelPage = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tab, setTab] = useState("home");
  const [showFullDesc, setShowFullDesc] = useState(false); // 👈 NEW

  useEffect(() => {
    fetchChannel();
    fetchVideos();
  }, [id]);

  const fetchChannel = async () => {
    const res = await api.get(`/channels/${id}`);
    setChannel(res.data);
  };

  const fetchVideos = async () => {
    const res = await api.get(`/videos?channel=${id}`);
    setVideos(res.data);
  };

  if (!channel) return <div className="cp-loading">Loading channel...</div>;

  const sortedVideos = [...videos].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const featured = sortedVideos[0];
  const restVideos = sortedVideos.slice(1);

  const description = channel.description || "";
  const isLong = description.length > 160;

  return (
    <div className="cp-page">
      {/* HEADER */}
      <div className="cp-header">
        <img src={media(channel.banner)} alt="" className="cp-banner" />

        <div className="cp-info">
          <img src={media(channel.avatar)} alt="" className="cp-avatar" />

          <div className="cp-text">
            <h1 className="cp-name">{channel.channelName}</h1>

            {/* DESCRIPTION WITH SHOW MORE */}
            <p className="cp-desc">
              {showFullDesc || !isLong
                ? description
                : description.slice(0, 160) + "..."}
            </p>

            {isLong && (
              <button
                className="cp-showmore-btn"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="cp-tabs">
        <button
          className={tab === "home" ? "cp-tab cp-active" : "cp-tab"}
          onClick={() => setTab("home")}
        >
          Home
        </button>
        <button
          className={tab === "videos" ? "cp-tab cp-active" : "cp-tab"}
          onClick={() => setTab("videos")}
        >
          Videos
        </button>
      </div>

      {/* HOME TAB */}
      {tab === "home" && featured && (
        <>
          <Link to={`/watch/${featured._id}`} className="cp-featured-card">
            <img
              src={media(featured.thumbnailUrl)}
              alt=""
              className="cp-featured-thumb"
            />
            <div className="cp-featured-info">
              <h2>{featured.title}</h2>
              <p className="cp-featured-desc">{featured.description}</p>
            </div>
          </Link>

          <div className="cp-grid">
            {restVideos.map((v) => (
              <Link key={v._id} to={`/watch/${v._id}`} className="cp-card">
                <img src={media(v.thumbnailUrl)} alt="" className="cp-thumb" />
                <div className="cp-meta-row">
                  <img src={media(channel.avatar)} alt="" className="cp-meta-avatar" />
                  <div>
                    <p className="cp-title">{v.title}</p>
                    <p className="cp-channel-name">{channel.channelName}</p>
                    <p className="cp-views">{v.views || 0} views</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* VIDEOS TAB */}
      {tab === "videos" && (
        <div className="cp-grid">
          {videos.map((v) => (
            <Link key={v._id} to={`/watch/${v._id}`} className="cp-card">
              <img src={media(v.thumbnailUrl)} alt="" className="cp-thumb" />
              <div className="cp-meta-row">
                <img src={media(channel.avatar)} alt="" className="cp-meta-avatar" />
                <div>
                  <p className="cp-title">{v.title}</p>
                  <p className="cp-channel-name">{channel.channelName}</p>
                  <p className="cp-views">{v.views || 0} views</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChannelPage;
