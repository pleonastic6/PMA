import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from "./components/layout/Navbar";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from "./pages/Register/Register";
import Profiles from "./pages/Profiles/Profiles";
import MapPage from './pages/MapPage/MapPage';
import EventsOverview from './pages/Events/EventsOverview';
import EventCreate from './pages/Events/EventCreate';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Register />} />
        <Route path="/profile" element={<Profiles />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/events" element={<EventsOverview />} />
        <Route path="/events/create" element={<EventCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
