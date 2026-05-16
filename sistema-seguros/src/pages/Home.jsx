import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSeguro } from '../context/SeguroContext';
import PlanCard from '../components/PlanCard';
import Notificacion from '../components/Notificacion';

// Hook personalizado: detecta cuando un elemento entra al viewport
function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = React.useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.15, ...options });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isVisible;
}

function StatCounter({ valor, etiqueta, prefijo = '', sufijo = '' }) {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const visible = useIntersectionObserver(ref);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = parseInt(valor);
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, valor]);

  return (
    <div className="stat-counter" ref={ref}>
      <span className="stat-counter__valor">{prefijo}{count.toLocaleString()}{sufijo}</span>
      <span className="stat-counter__etiqueta">{etiqueta}</span>
    </div>
  );
}

export default function Home() {
  const { PLANES_DATA } = useSeguro();
  const planesRef = useRef(null);
  const planesVisibles = useIntersectionObserver(planesRef);

  return (
    <div className="home">
      <Notificacion />

      {/* Hero */}
      <section className="hero">
        <div className="hero__contenido">
          <span className="hero__tag">🇪🇨 Aseguradora certificada en Ecuador</span>
          <h1 className="hero__titulo">
            Tu protección,<br />
            <span className="hero__titulo-acento">sin complicaciones.</span>
          </h1>
          <p className="hero__subtitulo">
            Planes de seguro flexibles para vida, vehículo, hogar y salud. Asesoría personalizada sin compromiso.
          </p>
          <div className="hero__acciones">
            <Link to="/planes" className="btn btn--primario">Explorar planes →</Link>
            <Link to="/contacto" className="btn btn--secundario">Hablar con un asesor</Link>
          </div>
        </div>
        <div className="hero__imagen">
          <div className="hero__blob">
            <span className="hero__blob-icono">🛡️</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <StatCounter valor="12500" etiqueta="Clientes protegidos" sufijo="+" />
        <StatCounter valor="4" etiqueta="Tipos de cobertura" />
        <StatCounter valor="98" etiqueta="Satisfacción del cliente" sufijo="%" />
        <StatCounter valor="15" etiqueta="Años de experiencia" sufijo="+" />
      </section>

      {/* Planes destacados */}
      <section className="planes-destacados" ref={planesRef}>
        <div className="seccion-header">
          <h2 className="seccion-titulo">Nuestros Planes</h2>
          <p className="seccion-subtitulo">Elige la cobertura que mejor se adapta a tu estilo de vida.</p>
        </div>
        <div className={`planes-grid ${planesVisibles ? 'planes-grid--visible' : ''}`}>
          {PLANES_DATA.map((plan, i) => (
            <div key={plan.id} style={{ animationDelay: `${i * 0.12}s` }} className="plan-card-wrapper">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
        <div className="planes-destacados__cta">
          <Link to="/planes" className="btn btn--outline">Ver todos los planes y comparar →</Link>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="beneficios">
        <div className="seccion-header">
          <h2 className="seccion-titulo">¿Por qué VitaSeguro?</h2>
        </div>
        <div className="beneficios__grid">
          {[
            { icono: '⚡', titulo: 'Respuesta inmediata', desc: 'Cotización en menos de 5 minutos con nuestro sistema digital.' },
            { icono: '🤝', titulo: 'Asesoría personalizada', desc: 'Un agente certificado te acompaña en cada paso del proceso.' },
            { icono: '💳', titulo: 'Pagos flexibles', desc: 'Mensual, trimestral o anual. Acepta todas las tarjetas y transferencias.' },
            { icono: '🔒', titulo: 'Datos seguros', desc: 'Tu información está protegida con encriptación de nivel bancario.' },
          ].map(({ icono, titulo, desc }) => (
            <div key={titulo} className="beneficio-card">
              <span className="beneficio-card__icono">{icono}</span>
              <h3 className="beneficio-card__titulo">{titulo}</h3>
              <p className="beneficio-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="cta-final">
        <h2>¿Listo para proteger lo que más importa?</h2>
        <p>Nuestros asesores están disponibles de lunes a sábado, de 8:00 a 18:00.</p>
        <Link to="/contacto" className="btn btn--primario btn--grande">Solicitar asesoría gratuita →</Link>
      </section>
    </div>
  );
}