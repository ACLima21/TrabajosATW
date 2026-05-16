import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSeguro } from '../context/SeguroContext';
import Notificacion from '../components/Notificacion';

export default function PlanDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estado, dispatch, PLANES_DATA } = useSeguro();

  const plan = PLANES_DATA.find(p => p.id === id);
  const enCotizacion = estado.cotizaciones.some(c => c.id === id);

  useEffect(() => {
    if (!plan) navigate('/planes', { replace: true });
  }, [plan, navigate]);

  if (!plan) return null;

  return (
    <div className="page-detalle">
      <Notificacion />

      <div className="page-detalle__breadcrumb">
        <Link to="/planes">← Todos los planes</Link>
      </div>

      <div className="page-detalle__contenido" style={{ '--plan-color': plan.color, '--plan-color-light': plan.colorLight }}>
        <div className="page-detalle__info">
          <span className="page-detalle__icono">{plan.icono}</span>
          <h1 className="page-detalle__nombre">{plan.nombre}</h1>
          <p className="page-detalle__precio">{plan.etiquetaPrecio}</p>
          <p className="page-detalle__descripcion">{plan.descripcionLarga}</p>

          <div className="page-detalle__popularidad">
            <span>Popularidad entre nuestros clientes</span>
            <div className="plan-card__barra">
              <div className="plan-card__barra-fill" style={{ width: `${plan.popularidad}%` }} />
            </div>
            <span>{plan.popularidad}%</span>
          </div>

          <div className="page-detalle__acciones">
            {enCotizacion ? (
              <button
                className="btn btn--quitar"
                onClick={() => dispatch({ tipo: 'QUITAR_COTIZACION', id: plan.id })}
              >
                Quitar de cotización
              </button>
            ) : (
              <button
                className="btn btn--primario"
                onClick={() => dispatch({ tipo: 'AGREGAR_COTIZACION', plan })}
              >
                Añadir a mi cotización
              </button>
            )}
            <Link to="/contacto" className="btn btn--secundario">Hablar con un asesor</Link>
          </div>
        </div>

        <div className="page-detalle__beneficios">
          <div className="beneficios-card">
            <h3>¿Qué incluye?</h3>
            <ul>
              {plan.beneficios.map(b => (
                <li key={b}>
                  <span className="beneficios-check">✓</span> {b}
                </li>
              ))}
            </ul>
            <div className="beneficios-card__cobertura">
              <span>Cobertura máxima</span>
              <strong>{plan.coberturaMaxima}</strong>
            </div>
          </div>

          <div className="otros-planes">
            <h4>Otros planes que podrían interesarte</h4>
            {PLANES_DATA.filter(p => p.id !== id).slice(0, 2).map(p => (
              <Link key={p.id} to={`/planes/${p.id}`} className="mini-plan-card">
                <span>{p.icono}</span>
                <div>
                  <strong>{p.nombre}</strong>
                  <p>{p.etiquetaPrecio}</p>
                </div>
                <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}