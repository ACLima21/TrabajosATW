import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSeguro } from '../context/SeguroContext';

export default function Navbar() {
  const { estado } = useSeguro();
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cantidadCotizaciones = estado.cotizaciones.length;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-icon">🛡️</span>
        <span className="navbar__logo-text">VitaSeguro</span>
      </Link>

      <button
        className={`navbar__hamburger ${menuAbierto ? 'abierto' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <ul className={`navbar__links ${menuAbierto ? 'navbar__links--abierto' : ''}`}>
        {[
          { to: '/', label: 'Inicio' },
          { to: '/planes', label: 'Planes' },
          { to: '/nosotros', label: 'Nosotros' },
          { to: '/contacto', label: 'Contacto' },
        ].map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--activo' : ''}`}
              onClick={() => setMenuAbierto(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
        <li>
          <Link to="/contacto" className="navbar__cta" onClick={() => setMenuAbierto(false)}>
            Mi Cotización
            {cantidadCotizaciones > 0 && (
              <span className="navbar__badge">{cantidadCotizaciones}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}