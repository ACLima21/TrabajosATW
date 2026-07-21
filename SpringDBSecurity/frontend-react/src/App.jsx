import { useEffect, useState } from 'react';
import './App.css';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductosPaginado
} from './services/productoService';

const productoVacio = {
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  activo: true
};

const TAMANIO_PAGINA = 5;

function App() {
  const [usuario, setUsuario] = useState('admin');
  const [clave, setClave] = useState('admin123lima');
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(productoVacio);
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // Estado de paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);

  useEffect(() => {
    cargarPagina(0);
  }, []);

  async function cargarPagina(page) {
    try {
      const data = await listarProductosPaginado(page, TAMANIO_PAGINA, usuario, clave);
      setProductos(data.content);
      setPaginaActual(data.page);
      setTotalPaginas(data.totalPages);
      setTotalElementos(data.totalElements);
      setMensaje(`Página ${data.page + 1} de ${data.totalPages} (${data.totalElements} productos)`);
    } catch (error) {
      manejarError(error);
    }
  }

  function paginaAnterior() {
    if (paginaActual > 0) {
      cargarPagina(paginaActual - 1);
    }
  }

  function paginaSiguiente() {
    if (paginaActual < totalPaginas - 1) {
      cargarPagina(paginaActual + 1);
    }
  }

  function cambiarCampo(event) {
    const { name, value, type, checked } = event.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  }

  async function guardar(event) {
    event.preventDefault();

    const producto = {
      ...formulario,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock)
    };

    try {
      if (editando && producto.id) {
        await actualizarProducto(producto.id, producto, usuario, clave);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await crearProducto(producto, usuario, clave);
        setMensaje('Producto registrado correctamente.');
      }

      limpiarFormulario();
      await cargarPagina(paginaActual);
    } catch (error) {
      manejarError(error);
    }
  }

  function seleccionar(producto) {
    setFormulario({ ...producto });
    setEditando(true);
  }

  async function eliminar(producto) {
    try {
      await eliminarProducto(producto.id, usuario, clave);
      setMensaje('Producto eliminado correctamente.');

      // Si era el único producto visible de una página que no es la primera,
      // retrocedemos una página para no dejar la tabla vacía.
      const eraUltimoDeLaPagina = productos.length === 1 && paginaActual > 0;
      const paginaDestino = eraUltimoDeLaPagina ? paginaActual - 1 : paginaActual;
      await cargarPagina(paginaDestino);
    } catch (error) {
      manejarError(error);
    }
  }

  function limpiarFormulario() {
    setFormulario(productoVacio);
    setEditando(false);
  }

  function manejarError(error) {
    if (error.status === 401) {
      setMensaje('Credenciales incorrectas.');
    } else if (error.status === 403) {
      setMensaje('El usuario autenticado requiere rol ADMIN para esta acción.');
    } else if (error.status === 409) {
      setMensaje('Ya existe un producto con ese nombre.');
    } else {
      setMensaje(error.message || 'Error inesperado.');
    }
  }

  return (
    <main className="contenedor">
      <h1>CRUD de productos - React</h1>

      <section className="tarjeta">
        <h2>Credenciales</h2>
        <label>Usuario</label>
        <input value={usuario} onChange={e => setUsuario(e.target.value)} />

        <label>Contraseña</label>
        <input type="password" value={clave} onChange={e => setClave(e.target.value)} />
      </section>

      <section className="tarjeta">
        <h2>{editando ? 'Editar producto' : 'Registrar producto'}</h2>

        <form onSubmit={guardar}>
          <label>Nombre</label>
          <input name="nombre" value={formulario.nombre} onChange={cambiarCampo} required />

          <label>Descripción</label>
          <input name="descripcion" value={formulario.descripcion} onChange={cambiarCampo} required />

          <label>Precio</label>
          <input name="precio" type="number" value={formulario.precio} onChange={cambiarCampo} required />

          <label>Stock</label>
          <input name="stock" type="number" value={formulario.stock} onChange={cambiarCampo} required />

          <label>
            <input name="activo" type="checkbox" checked={formulario.activo} onChange={cambiarCampo} />
            Activo
          </label>

          <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
          <button type="button" onClick={limpiarFormulario}>Limpiar</button>
        </form>
      </section>

      <section className="tarjeta">
        <h2>Listado de productos</h2>

        <p className="mensaje">{mensaje}</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button onClick={() => seleccionar(producto)}>Editar</button>
                  <button onClick={() => eliminar(producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="paginador">
          <button onClick={paginaAnterior} disabled={paginaActual === 0}>
            Anterior
          </button>

          <span>
            Página {paginaActual + 1} de {totalPaginas || 1} ({totalElementos} productos)
          </span>

          <button onClick={paginaSiguiente} disabled={paginaActual >= totalPaginas - 1}>
            Siguiente
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;