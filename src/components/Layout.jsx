import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const location = useLocation();

  const isVideoPage = location.pathname.startsWith("/watch/");
  const isAuthPage = location.pathname === "/auth";
  const isChannelDash = location.pathname === "/auth/channel";

  /* ================= DETECT LANDSCAPE MODE ================= */
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  /* ================= MAIN CONTENT CLASS LOGIC ================= */
  let contentClass = "content";

  if (isAuthPage) {
    contentClass += " auth-layout";
  } else if (isVideoPage) {
    contentClass += " full-width";
  } else if (isChannelDash) {
    contentClass += " dashboard-layout";
  } else if (isOpen && (isLandscape || window.innerWidth > 1024)) {
    contentClass += " with-sidebar";
  } else if (!isOpen && (isLandscape || window.innerWidth > 1024)) {
    contentClass += " no-sidebar";
  }

  /* ================= SIDEBAR VISIBILITY RULES ================= */
  const showSidebar =
    !isVideoPage &&
    !isAuthPage &&
    !isChannelDash &&
    (isLandscape || window.innerWidth > 1024);

  return (
    <>
      {/* Header always visible */}
      <Header toggleSidebar={() => setIsOpen(!isOpen)} />

      {/* Sidebar only in landscape tablets OR desktop */}
      {showSidebar && <Sidebar isOpen={isOpen} />}

      {/* Page Content */}
      <main className={contentClass}>
        <Outlet context={{ sidebarOpen: isOpen }} />
      </main>
    </>
  );
};

export default Layout;
