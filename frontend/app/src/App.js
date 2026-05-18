import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from "./components/layout/Navbar";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import MapPage from './pages/MapPage/MapPage';
import EventsOverview from './pages/Events/EventsOverview';
import EventCreate from './pages/Events/EventCreate';
import EventDetail from './pages/Events/EventDetail';
import CreatingProfile from './pages/Register/CreatingProfile';
import SelectingPictures from './pages/Register/SelectingPictures';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Register />}/>
        <Route path='/CreatingProfile' element={<CreatingProfile />}/>
        <Route path='/SelectingPictures' element={<SelectingPictures />}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/events" element={<EventsOverview />} />
        <Route path="/events/create" element={<EventCreate />} />
        <Route path="/events/:id" element={<EventDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
