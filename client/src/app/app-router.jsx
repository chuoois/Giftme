// src/router.js
import { createBrowserRouter } from "react-router-dom";
import {
  HomeLayout,
  AuthLayout,
  AdminLayout,
} from '@/components/layout';
import {
  HomePage,
  ComboPage,
  ComboDetailPage,
  NewsPage,
  NewsDetailPage,
} from '@/pages/pages-home';
import { LoginPage } from '@/pages/pages-admin-login';
import {
  AdminDashboardPage,
  AdminCombosPage,
  AdminNewsPage,
  AdminContentPage,
  AdminBotPage
} from "@/pages/pages-admin";
import { ContactPage } from "@/pages/pages-home/contact";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import TrackPageView from "./TrackPageView";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        element: (
          <>
            <AuthLayout />
            <TrackPageView />
          </>
        ),
        children: [{ path: "login", element: <LoginPage /> }],
      },
    ],
  },
  {
    path: "/",
    element: (
      <>
        <HomeLayout />
        <TrackPageView />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "combo", element: <ComboPage /> },
      { path: "combo/:id", element: <ComboDetailPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "news/:id", element: <NewsDetailPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
  {
    path: "/admin",
    element: <PrivateRoute />,
    children: [
      {
        element: (
          <>
            <AdminLayout />
            <TrackPageView />
          </>
        ),
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "combos", element: <AdminCombosPage /> },
          { path: "news", element: <AdminNewsPage /> },
          { path: "contents", element: <AdminContentPage /> },
          { path: "bot", element: <AdminBotPage /> },
        ],
      },
    ],
  },
]);