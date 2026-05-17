import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppStateProvider } from './context/AppStateContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from "./components/layout/Navbar";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import MapPage from './pages/MapPage/MapPage.jsx';
import EventsOverview from './pages/Events/EventsOverview.jsx';
import EventCreate from './pages/Events/EventCreate.jsx';
import CreatingProfile from './pages/Register/CreatingProfile';
import SelectingPictures from './pages/Register/SelectingPictures';
import SwipePage from './pages/Swipe/SwipePage';
import Settings from './pages/Settings/Settings';
import Insights from './pages/Insights/Insights';
import MatchesPage from './pages/Matches/MatchesPage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/swipe" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
            <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/Login" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
            <Route path="/Signup" element={<Navigate to="/signup" replace />} />
            <Route path='/CreatingProfile' element={<CreatingProfile />} />
            <Route path='/SelectingPictures' element={<SelectingPictures />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/events" element={<EventsOverview />} />
            <Route path="/events/create" element={<EventCreate />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;
