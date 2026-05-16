import React from 'react';
import { useSeguro } from '../context/SeguroContext';
import PlanCard from '../components/PlanCard';
import Notificacion from '../components/Notificacion';

const FILTROS = [
  { valor: 'todos', label: 'Todos los planes' },
  { valor: 'economico', label: 'Hasta $20/mes' },
  { valor: 'medio', label: '$20 – $50/mes' },
  { valor: 'premium', label: 'Más de $50/mes' },
];

export default function Planes() {
  const { estado, dispatch, PLANES_DATA } = useSeguro();
  const { filtro, cotizaciones } = estado;

  const planesFiltrados = PLANES_DATA.filter(plan => {
    if (filtro === 'economico') return plan.precio <= 20;
    if (filtro === 'medio') return plan.precio > 20 && plan.precio <= 50;
    if (filtro === 'premium') return plan.precio > 50;
    return true;
  });

  const totalMensual = cotizaciones.reduce((sum, c) => sum + c.precio, 0);

  return (
    <div className="page-planes">
      <Notificacion />

      <div className="page-planes__header">
        <h1 className="page-titulo">Nuestros Planes de Seguro</h1>
        <p className="page-subtitulo">Filtra y selecciona los planes que deseas cotizar juntos.</p>
      </div>

      {/* Filtros */}
      <div className="filtros">
        {FILTROS.map(f => (
          <button
            key={f.valor}
            className={`filtros__btn ${filtro === f.valor ? 'filtros__btn--activo' : ''}`}
            onClick={() => dispatch({ tipo: 'CAMBIAR_FILTRO', filtro: f.valor })}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid de planes */}
      {planesFiltrados.length === 0 ? (
        <div className="planes-vacio">
          <p>No hay planes en ese rango de precio.</p>
          <button className="btn btn--outline" onClick={() => dispatch({ tipo: 'CAMBIAR_FILTRO', filtro: 'todos' })}>
            Ver todos
          </button>
        </div>
      ) : (
        <div className="planes-grid planes-grid--visible">
          {planesFiltrados.map((plan, i) => (
            <div key={plan.id} style={{ animationDelay: `${i * 0.1}s` }} className="plan-card-wrapper">
              <PlanCard plan={plan} />
            </div>
          ))}
        </div>
      )}

      {/* Resumen de cotización */}
      {cotizaciones.length > 0 && (
        <div className="resumen-cotizacion">
          <h3 className="resumen-cotizacion__titulo">📋 Tu Cotización Actual</h3>
          <ul className="resumen-cotizacion__lista">
            {cotizaciones.map(c => (
              <li key={c.id} className="resumen-cotizacion__item">
                <span>{c.icono} {c.nombre}</span>
                <span>${c.precio.toFixed(2)}/mes</span>
                <button
                  className="resumen-cotizacion__quitar"
                  onClick={() => dispatch({ tipo: 'QUITAR_COTIZACION', id: c.id })}
                >✕</button>
              </li>
            ))}
          </ul>
          <div className="resumen-cotizacion__total">
            <strong>Total estimado:</strong>
            <strong>${totalMensual.toFixed(2)} / mes</strong>
          </div>
          <p className="resumen-cotizacion__nota">* Sujeto a inspección y políticas de la aseguradora.</p>
        </div>
      )}
    </div>
  );
}