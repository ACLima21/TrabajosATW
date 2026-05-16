import React from 'react';
import { Link } from 'react-router-dom';

const EQUIPO = [
  { nombre: 'Dra. Lucía Torres', rol: 'Directora General', icono: '👩‍💼', años: 12 },
  { nombre: 'Ing. Carlos Vega', rol: 'Jefe de Siniestros', icono: '👨‍💻', años: 8 },
  { nombre: 'Lic. Ana Morales', rol: 'Asesora Senior', icono: '👩‍🏫', años: 10 },
  { nombre: 'Mg. Pedro Ruiz', rol: 'Actuario', icono: '👨‍🔬', años: 6 },
];

const HITOS = [
  { año: 2009, evento: 'Fundación de VitaSeguro en Quito.' },
  { año: 2013, evento: 'Apertura de sucursal en Guayaquil.' },
  { año: 2017, evento: 'Lanzamiento del portal digital de cotización.' },
  { año: 2021, evento: 'Certificación ISO 9001 en gestión de calidad.' },
  { año: 2024, evento: 'Más de 12,500 clientes asegurados a nivel nacional.' },
];

export default function Nosotros() {
  return (
    <div className="page-nosotros">
      <section className="nosotros-hero">
        <h1 className="page-titulo">Sobre VitaSeguro</h1>
        <p className="page-subtitulo-nosotros">
          Somos una asesora de seguros ecuatoriana con más de 15 años de trayectoria, comprometidos con la protección de familias y empresas.
        </p>
      </section>

      <section className="nosotros-mision">
        <div className="mision-card">
          <span>🎯</span>
          <h3>Misión</h3>
          <p>Brindar soluciones de seguro accesibles y transparentes que protejan el bienestar de nuestros clientes en Ecuador.</p>
        </div>
        <div className="mision-card">
          <span>🔭</span>
          <h3>Visión</h3>
          <p>Ser la asesora de seguros más confiable y tecnológicamente avanzada del país para el 2030.</p>
        </div>
        <div className="mision-card">
          <span>💎</span>
          <h3>Valores</h3>
          <p>Honestidad, transparencia, innovación y compromiso con cada uno de nuestros asegurados.</p>
        </div>
      </section>

      <section className="nosotros-historia">
        <h2>Nuestra historia</h2>
        <div className="timeline">
          {HITOS.map((h, i) => (
            <div key={h.año} className={`timeline__item ${i % 2 === 0 ? 'timeline__item--izq' : 'timeline__item--der'}`}>
              <div className="timeline__año">{h.año}</div>
              <div className="timeline__evento">{h.evento}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="nosotros-equipo">
        <h2>Nuestro Equipo</h2>
        <div className="equipo-grid">
          {EQUIPO.map(m => (
            <div key={m.nombre} className="equipo-card">
              <span className="equipo-card__avatar">{m.icono}</span>
              <h4 className="equipo-card__nombre">{m.nombre}</h4>
              <p className="equipo-card__rol">{m.rol}</p>
              <p className="equipo-card__años">{m.años} años de experiencia</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-final">
        <h2>¿Tienes preguntas? Estamos aquí.</h2>
        <Link to="/contacto" className="btn btn--primario btn--grande">Contáctanos →</Link>
      </section>
    </div>
  );
}