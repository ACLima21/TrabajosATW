import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Datos centralizados de planes ───────────────────────────────────────────
export const PLANES_DATA = [
  {
    id: 'vida',
    nombre: 'Seguro de Vida',
    icono: '❤️',
    color: '#e63946',
    colorLight: '#fde8ea',
    precio: 12.50,
    etiquetaPrecio: 'Desde $12.50 / mes',
    detalle: 'Cobertura por muerte accidental y gastos funerarios.',
    descripcionLarga: 'Protege a tu familia con nuestra póliza de vida más completa. Incluye cobertura por muerte accidental, invalidez total y permanente, y reembolso de gastos funerarios. Nuestros asesores te guiarán para elegir el monto de cobertura ideal según tu situación familiar.',
    beneficios: ['Cobertura por muerte accidental', 'Invalidez total y permanente', 'Gastos funerarios incluidos', 'Beneficiarios múltiples', 'Sin período de espera'],
    coberturaMaxima: '$50,000',
    popularidad: 87,
  },
  {
    id: 'vehicular',
    nombre: 'Seguro Vehicular',
    icono: '🚗',
    color: '#3d93b1',
    colorLight: '#e0f0f8',
    precio: 35.00,
    etiquetaPrecio: 'Desde $35.00 / mes',
    detalle: 'Protección contra choque, robo y daños a terceros.',
    descripcionLarga: 'Tu vehículo es una inversión importante. Con VitaSeguro Vehicular tienes protección ante colisiones, robo total o parcial, daños a terceros y asistencia en carretera 24/7 en todo Ecuador. Aplica para autos, camionetas y vehículos de trabajo.',
    beneficios: ['Choque y volcamiento', 'Robo total y parcial', 'Daños a terceros', 'Asistencia 24/7 en carretera', 'Vehículo de reemplazo'],
    coberturaMaxima: '$80,000',
    popularidad: 95,
  },
  {
    id: 'hogar',
    nombre: 'Seguro de Hogar',
    icono: '🏠',
    color: '#2a9d8f',
    colorLight: '#e0f5f3',
    precio: 8.90,
    etiquetaPrecio: 'Desde $8.90 / mes',
    detalle: 'Cobertura contra incendios, inundaciones y robo.',
    descripcionLarga: 'Tu hogar merece la mejor protección. Cubrimos daños por incendio, inundación, terremoto, robo con violencia y responsabilidad civil frente a vecinos. Disponible para casas propias, arrendadas y departamentos en todo Ecuador.',
    beneficios: ['Incendio y explosión', 'Inundación y terremoto', 'Robo con violencia', 'Responsabilidad civil', 'Contenido del hogar'],
    coberturaMaxima: '$120,000',
    popularidad: 73,
  },
  {
    id: 'salud',
    nombre: 'Seguro de Salud',
    icono: '🏥',
    color: '#6a4c93',
    colorLight: '#ede7f6',
    precio: 45.00,
    etiquetaPrecio: 'Desde $45.00 / mes',
    detalle: 'Atención médica privada sin deducibles elevados.',
    descripcionLarga: 'Accede a la mejor red médica privada del Ecuador con deducibles bajos y amplia cobertura. Incluye hospitalización, cirugías, consultas especializadas, medicamentos y atención de emergencia a nivel nacional e internacional.',
    beneficios: ['Hospitalización y cirugía', 'Consultas especializadas', 'Medicamentos cubiertos', 'Emergencias internacionales', 'Maternidad incluida'],
    coberturaMaxima: '$200,000',
    popularidad: 91,
  },
];

// ─── Estado inicial ───────────────────────────────────────────────────────────
const estadoInicial = {
  cotizaciones: [],          // planes guardados en cotización
  planSeleccionado: null,    // plan activo para detalle
  filtro: 'todos',           // filtro activo en la lista
  notificacion: null,        // { mensaje, tipo } para feedback global
  formularioEnviado: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function seguroReducer(estado, accion) {
  switch (accion.tipo) {
    case 'AGREGAR_COTIZACION': {
      const yaExiste = estado.cotizaciones.find(c => c.id === accion.plan.id);
      if (yaExiste) {
        return {
          ...estado,
          notificacion: { mensaje: `${accion.plan.nombre} ya está en tu cotización.`, tipo: 'info' },
        };
      }
      return {
        ...estado,
        cotizaciones: [...estado.cotizaciones, accion.plan],
        notificacion: { mensaje: `${accion.plan.nombre} añadido a tu cotización.`, tipo: 'exito' },
      };
    }
    case 'QUITAR_COTIZACION':
      return {
        ...estado,
        cotizaciones: estado.cotizaciones.filter(c => c.id !== accion.id),
        notificacion: { mensaje: 'Plan eliminado de tu cotización.', tipo: 'advertencia' },
      };
    case 'SELECCIONAR_PLAN':
      return { ...estado, planSeleccionado: accion.plan };
    case 'CAMBIAR_FILTRO':
      return { ...estado, filtro: accion.filtro };
    case 'LIMPIAR_NOTIFICACION':
      return { ...estado, notificacion: null };
    case 'MARCAR_FORMULARIO_ENVIADO':
      return { ...estado, formularioEnviado: true };
    case 'RESET_FORMULARIO':
      return { ...estado, formularioEnviado: false };
    default:
      return estado;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const SeguroContext = createContext(null);

export function SeguroProvider({ children }) {
  const [estado, dispatch] = useReducer(seguroReducer, estadoInicial);

  // Auto-limpiar notificaciones tras 3 segundos
  useEffect(() => {
    if (estado.notificacion) {
      const timer = setTimeout(() => dispatch({ tipo: 'LIMPIAR_NOTIFICACION' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [estado.notificacion]);

  return (
    <SeguroContext.Provider value={{ estado, dispatch, PLANES_DATA }}>
      {children}
    </SeguroContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export function useSeguro() {
  const ctx = useContext(SeguroContext);
  if (!ctx) throw new Error('useSeguro debe usarse dentro de SeguroProvider');
  return ctx;
}