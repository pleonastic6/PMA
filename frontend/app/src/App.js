import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Navbar from "./components/layout/Navbar";
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
