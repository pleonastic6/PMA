import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import UserProfilePage from "./pages/Profile/UserProfilePage";
import MapPage from './pages/MapPage/MapPage';
import EventsOverview from './pages/Events/EventsOverview';
import EventCreate from './pages/Events/EventCreate';
import SwipePage from './pages/Swipe/SwipePage';
import MatchesPage from './pages/Matches/MatchesPage';
import ChatPage from './pages/Chat/ChatPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Lädt...</main>;
  }

  return isAuthenticated ? children : <Login />;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center">Lädt...</main>;
  }

  return isAuthenticated ? <Profile /> : children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/Signup" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>}/>
        <Route path="/swipe" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/people/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsOverview /></ProtectedRoute>} />
        <Route path="/events/create" element={<ProtectedRoute><EventCreate /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
