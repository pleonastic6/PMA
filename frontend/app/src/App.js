import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from "./components/layout/Navbar";
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import MapPage from './pages/MapPage/MapPage';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
