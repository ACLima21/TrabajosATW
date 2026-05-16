import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeguro } from '../context/SeguroContext';

export default function PlanCard({ plan, modoCompacto = false }) {
  const { estado, dispatch } = useSeguro();
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  const enCotizacion = estado.cotizaciones.some(c => c.id === plan.id);

  const handleCotizar = (e) => {
    e.stopPropagation();
    dispatch({ tipo: 'AGREGAR_COTIZACION', plan });
  };

  const handleQuitar = (e) => {
    e.stopPropagation();
    dispatch({ tipo: 'QUITAR_COTIZACION', id: plan.id });
  };

  return (
    <div
      className={`plan-card ${hover ? 'plan-card--hover' : ''} ${enCotizacion ? 'plan-card--seleccionado' : ''}`}
      style={{ '--plan-color': plan.color, '--plan-color-light': plan.colorLight }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate(`/planes/${plan.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/planes/${plan.id}`)}
    >
      <div className="plan-card__header">
        <span className="plan-card__icono">{plan.icono}</span>
        {enCotizacion && <span className="plan-card__badge-seleccionado">✓ En cotización</span>}
      </div>

      <h3 className="plan-card__nombre">{plan.nombre}</h3>
      <p className="plan-card__precio">{plan.etiquetaPrecio}</p>
      <p className="plan-card__detalle">{plan.detalle}</p>

      {!modoCompacto && (
        <div className="plan-card__popularidad">
          <span className="plan-card__popularidad-label">Popularidad</span>
          <div className="plan-card__barra">
            <div
              className="plan-card__barra-fill"
              style={{ width: `${plan.popularidad}%` }}
            />
          </div>
          <span className="plan-card__popularidad-valor">{plan.popularidad}%</span>
        </div>
      )}

      <div className="plan-card__acciones">
        <button className="plan-card__btn-detalle" onClick={(e) => { e.stopPropagation(); navigate(`/planes/${plan.id}`); }}>
          Ver detalle
        </button>
        {enCotizacion ? (
          <button className="plan-card__btn-quitar" onClick={handleQuitar}>
            Quitar
          </button>
        ) : (
          <button className="plan-card__btn-cotizar" onClick={handleCotizar}>
            Cotizar
          </button>
        )}
      </div>
    </div>
  );
}