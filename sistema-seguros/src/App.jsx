import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SeguroProvider } from './context/SeguroContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Planes from './pages/Planes';
import PlanDetalle from './pages/PlanDetalle';
import Contacto from './pages/Contacto';
import Nosotros from './pages/Nosotros';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <SeguroProvider>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planes" element={<Planes />} />
              <Route path="/planes/:id" element={<PlanDetalle />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/nosotros" element={<Nosotros />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SeguroProvider>
    </BrowserRouter>
  );
}

export default App;