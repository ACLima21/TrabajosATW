import React, { useState, useCallback } from 'react';
import { useSeguro } from '../context/SeguroContext';

const CAMPO_INICIAL = { nombre: '', email: '', telefono: '', interes: '', mensaje: '' };
const ERRORES_INICIAL = {};

function validar(campos) {
  const errores = {};
  if (!campos.nombre.trim()) errores.nombre = 'El nombre es obligatorio.';
  if (!campos.email.trim() || !/\S+@\S+\.\S+/.test(campos.email)) errores.email = 'Ingresa un correo válido.';
  if (!campos.interes) errores.interes = 'Selecciona un plan de interés.';
  return errores;
}

export default function Contacto() {
  const { estado, dispatch, PLANES_DATA } = useSeguro();
  const { formularioEnviado, cotizaciones } = estado;

  const [campos, setCampos] = useState({
    ...CAMPO_INICIAL,
    interes: cotizaciones.length > 0 ? cotizaciones[0].id : '',
  });
  const [errores, setErrores] = useState(ERRORES_INICIAL);
  const [cargando, setCargando] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCampos(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: undefined }));
  }, [errores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(campos);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    setCargando(true);
    // Simula llamada a API
    await new Promise(res => setTimeout(res, 1500));
    setCargando(false);
    dispatch({ tipo: 'MARCAR_FORMULARIO_ENVIADO' });
    setCampos(CAMPO_INICIAL);
  };

  const handleNueva = () => dispatch({ tipo: 'RESET_FORMULARIO' });

  if (formularioEnviado) {
    return (
      <div className="page-contacto">
        <div className="exito-card">
          <span className="exito-card__icono">🎉</span>
          <h2>¡Solicitud recibida!</h2>
          <p>Uno de nuestros asesores se comunicará contigo en menos de 24 horas hábiles.</p>
          <button className="btn btn--primario" onClick={handleNueva}>Enviar otra consulta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-contacto">
      <div className="page-contacto__layout">
        <div className="page-contacto__info">
          <h1 className="page-titulo">Solicitar Asesoría Gratuita</h1>
          <p className="page-subtitulo">Completa el formulario y un asesor certificado se pondrá en contacto contigo.</p>

          <div className="contacto-datos">
            <div className="contacto-dato"><span>📞</span><span>(02) 234-5678</span></div>
            <div className="contacto-dato"><span>✉️</span><span>info@vitaseguro.ec</span></div>
            <div className="contacto-dato"><span>🕐</span><span>Lun – Sáb, 8:00 a 18:00</span></div>
            <div className="contacto-dato"><span>📍</span><span>Quito, Ecuador</span></div>
          </div>

          {cotizaciones.length > 0 && (
            <div className="cotizacion-resumen-contacto">
              <h4>Planes en tu cotización</h4>
              {cotizaciones.map(c => (
                <div key={c.id} className="cotizacion-resumen-contacto__item">
                  <span>{c.icono} {c.nombre}</span>
                  <span>${c.precio.toFixed(2)}/mes</span>
                </div>
              ))}
              <div className="cotizacion-resumen-contacto__total">
                Total: <strong>${cotizaciones.reduce((s, c) => s + c.precio, 0).toFixed(2)}/mes</strong>
              </div>
            </div>
          )}
        </div>

        <form className="formulario-contacto" onSubmit={handleSubmit} noValidate>
          <div className="formulario-contacto__campo">
            <label htmlFor="nombre">Nombre completo *</label>
            <input
              id="nombre" name="nombre" type="text"
              value={campos.nombre} onChange={handleChange}
              placeholder="Ej: María García"
              className={errores.nombre ? 'campo--error' : ''}
            />
            {errores.nombre && <span className="campo-error-msg">{errores.nombre}</span>}
          </div>

          <div className="formulario-contacto__campo">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              id="email" name="email" type="email"
              value={campos.email} onChange={handleChange}
              placeholder="tu@correo.com"
              className={errores.email ? 'campo--error' : ''}
            />
            {errores.email && <span className="campo-error-msg">{errores.email}</span>}
          </div>

          <div className="formulario-contacto__campo">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input
              id="telefono" name="telefono" type="tel"
              value={campos.telefono} onChange={handleChange}
              placeholder="09X XXX XXXX"
            />
          </div>

          <div className="formulario-contacto__campo">
            <label htmlFor="interes">Plan de interés *</label>
            <select
              id="interes" name="interes"
              value={campos.interes} onChange={handleChange}
              className={errores.interes ? 'campo--error' : ''}
            >
              <option value="">Selecciona un plan...</option>
              {PLANES_DATA.map(p => (
                <option key={p.id} value={p.id}>{p.icono} {p.nombre}</option>
              ))}
              <option value="varios">Múltiples planes</option>
            </select>
            {errores.interes && <span className="campo-error-msg">{errores.interes}</span>}
          </div>

          <div className="formulario-contacto__campo">
            <label htmlFor="mensaje">Mensaje (opcional)</label>
            <textarea
              id="mensaje" name="mensaje"
              value={campos.mensaje} onChange={handleChange}
              placeholder="Cuéntanos sobre tus necesidades..."
              rows={4}
            />
          </div>

          <button type="submit" className="btn btn--primario btn--grande" disabled={cargando}>
            {cargando ? (
              <span className="btn-spinner">⏳ Enviando...</span>
            ) : (
              'Enviar solicitud →'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}