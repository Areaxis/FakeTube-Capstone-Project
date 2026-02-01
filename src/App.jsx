import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* ================= LAZY LOADED PAGES ================= */
const Layout = lazy(() => import("./components/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ChannelDashboard = lazy(() => import("./pages/ChannelDashboard"));
const ChannelPage = lazy(() => import("./pages/ChannelPage")); // ⭐ NEW

/* ================= ROUTER CONFIG ================= */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },                 // Home
      { path: "watch/:id", element: <VideoPage /> },          // Watch page
      { path: "category/:name", element: <HomePage /> },      // Category filter
      { path: "search/:query", element: <HomePage /> },       // Search filter
      { path: "auth", element: <AuthPage /> },                // Login/Register
      { path: "auth/channel", element: <ChannelDashboard /> },// Channel dashboard

      // ================= CHANNEL PAGES =================
      { path: "channel/:id", element: <ChannelPage /> },         // Channel Home tab
      { path: "channel/:id/videos", element: <ChannelPage /> }   // Channel Videos tab
    ]
  }
]);

function App() {
  return (
    <Suspense fallback={<h2 style={{ padding: "20px" }}>Loading...</h2>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
