import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__marca">
          <span className="footer__logo">🛡️ VitaSeguro</span>
          <p className="footer__slogan">Protección a tu medida en Ecuador. Tu tranquilidad, nuestra misión.</p>
        </div>
        <div className="footer__links">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/planes">Planes</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="footer__links">
          <h4>Planes</h4>
          <ul>
            <li><Link to="/planes/vida">Seguro de Vida</Link></li>
            <li><Link to="/planes/vehicular">Seguro Vehicular</Link></li>
            <li><Link to="/planes/hogar">Seguro de Hogar</Link></li>
            <li><Link to="/planes/salud">Seguro de Salud</Link></li>
          </ul>
        </div>
        <div className="footer__contacto">
          <h4>Contacto</h4>
          <p>📞 (02) 234-5678</p>
          <p>✉️ info@vitaseguro.ec</p>
          <p>📍 Quito, Ecuador</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} VitaSeguro Ecuador. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}