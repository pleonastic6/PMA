import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swipe" element={<SwipePage />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Register />} />
          <Route path='/CreatingProfile' element={<CreatingProfile />} />
          <Route path='/SelectingPictures' element={<SelectingPictures />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/events" element={<EventsOverview />} />
          <Route path="/events/create" element={<EventCreate />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
