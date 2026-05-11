import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import ProtectedRoute from './ProtectedRoute'

// 页面组件
import SelectedPage from '@/pages/SelectedPage'
import AllNewsPage from '@/pages/AllNewsPage'
import HotTopicsPage from '@/pages/HotTopicsPage'
import AIDailyPage from '@/pages/AIDailyPage'
import AgentPage from '@/pages/AgentPage'
import AboutPage from '@/pages/AboutPage'
import ChangelogPage from '@/pages/ChangelogPage'
import FeedbackPage from '@/pages/FeedbackPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'
import FavoritesPage from '@/pages/FavoritesPage'
import LikesPage from '@/pages/LikesPage'
import HistoryPage from '@/pages/HistoryPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/selected" replace /> },
      { path: 'selected', element: <SelectedPage /> },
      { path: 'hot', element: <HotTopicsPage /> },
      { path: 'all', element: <AllNewsPage /> },
      { path: 'daily', element: <AIDailyPage /> },
      { path: 'agent', element: <AgentPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'changelog', element: <ChangelogPage /> },
      { path: 'feedback', element: <ProtectedRoute><FeedbackPage /></ProtectedRoute> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'profile/favorites', element: <ProtectedRoute><FavoritesPage /></ProtectedRoute> },
      { path: 'profile/likes', element: <ProtectedRoute><LikesPage /></ProtectedRoute> },
      { path: 'profile/history', element: <ProtectedRoute><HistoryPage /></ProtectedRoute> },
    ],
  },
])
