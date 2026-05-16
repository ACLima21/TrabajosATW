import React from 'react';
import { useSeguro } from '../context/SeguroContext';

export default function Notificacion() {
  const { estado, dispatch } = useSeguro();
  const { notificacion } = estado;

  if (!notificacion) return null;

  return (
    <div className={`notificacion notificacion--${notificacion.tipo}`}>
      <span className="notificacion__icono">
        {{ exito: '✅', info: 'ℹ️', advertencia: '⚠️', error: '❌' }[notificacion.tipo]}
      </span>
      <p className="notificacion__mensaje">{notificacion.mensaje}</p>
      <button className="notificacion__cerrar" onClick={() => dispatch({ tipo: 'LIMPIAR_NOTIFICACION' })}>✕</button>
    </div>
  );
}