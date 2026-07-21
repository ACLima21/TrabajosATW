<script>
  import { onMount } from 'svelte';
  import {
    listarProductosPaginado,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } from './services/productoService.js';

  let usuario = 'admin';
  let clave = 'admin123lima';

  let productos = [];
  let editando = false;
  let idEditando = null;
  let mensaje = '';

  // Estado de paginación
  let paginaActual = 0;
  let totalPaginas = 0;
  let totalElementos = 0;
  const TAMANIO_PAGINA = 5;

  function productoVacio() {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      activo: true
    };
  }

  let formulario = productoVacio();

  onMount(() => {
    cargarPagina(0);
  });

  async function cargarPagina(page) {
    try {
      const data = await listarProductosPaginado(page, TAMANIO_PAGINA, usuario, clave);
      productos = data.content;
      paginaActual = data.page;
      totalPaginas = data.totalPages;
      totalElementos = data.totalElements;
      mensaje = `Página ${data.page + 1} de ${data.totalPages} (${data.totalElements} productos)`;
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

  async function guardar(event) {
    event.preventDefault();

    const producto = {
      ...formulario,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock)
    };

    try {
      if (editando && idEditando !== null) {
        await actualizarProducto(idEditando, producto, usuario, clave);
        mensaje = 'Producto actualizado correctamente.';
      } else {
        await crearProducto(producto, usuario, clave);
        mensaje = 'Producto registrado correctamente.';
      }

      limpiarFormulario();
      await cargarPagina(paginaActual);
    } catch (error) {
      manejarError(error);
    }
  }

  function seleccionar(producto) {
    formulario = { ...producto };
    idEditando = producto.id;
    editando = true;
  }

  async function eliminar(producto) {
    try {
      await eliminarProducto(producto.id, usuario, clave);
      mensaje = 'Producto eliminado correctamente.';

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
    formulario = productoVacio();
    editando = false;
    idEditando = null;
  }

  function manejarError(error) {
    if (error.status === 401) {
      mensaje = 'Credenciales incorrectas.';
    } else if (error.status === 403) {
      mensaje = 'El usuario autenticado requiere rol ADMIN para esta acción.';
    } else if (error.status === 409) {
      mensaje = 'Ya existe un producto con ese nombre.';
    } else {
      mensaje = error.message || 'Error inesperado.';
    }
  }
</script>

<main class="contenedor">
  <h1>CRUD de productos - Svelte</h1>

  <section class="tarjeta">
    <h2>Credenciales</h2>
    <label>Usuario</label>
    <input bind:value={usuario} />

    <label>Contraseña</label>
    <input type="password" bind:value={clave} />
  </section>

  <section class="tarjeta">
    <h2>{editando ? 'Editar producto' : 'Registrar producto'}</h2>

    <form on:submit={guardar}>
      <label>Nombre</label>
      <input bind:value={formulario.nombre} required />

      <label>Descripción</label>
      <input bind:value={formulario.descripcion} required />

      <label>Precio</label>
      <input type="number" bind:value={formulario.precio} required />

      <label>Stock</label>
      <input type="number" bind:value={formulario.stock} required />

      <label>
        <input type="checkbox" bind:checked={formulario.activo} />
        Activo
      </label>

      <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
      <button type="button" on:click={limpiarFormulario}>Limpiar</button>
    </form>
  </section>

  <section class="tarjeta">
    <h2>Listado de productos</h2>

    <p class="mensaje">{mensaje}</p>

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
        {#each productos as producto (producto.id)}
          <tr>
            <td>{producto.id}</td>
            <td>{producto.nombre}</td>
            <td>{producto.precio}</td>
            <td>{producto.stock}</td>
            <td>{producto.activo ? 'Sí' : 'No'}</td>
            <td>
              <button on:click={() => seleccionar(producto)}>Editar</button>
              <button on:click={() => eliminar(producto)}>Eliminar</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="paginador">
      <button on:click={paginaAnterior} disabled={paginaActual === 0}>
        Anterior
      </button>

      <span>
        Página {paginaActual + 1} de {totalPaginas || 1} ({totalElementos} productos)
      </span>

      <button on:click={paginaSiguiente} disabled={paginaActual >= totalPaginas - 1}>
        Siguiente
      </button>
    </div>
  </section>
</main>

<style>
  .contenedor {
    max-width: 1100px;
    margin: 20px auto;
    font-family: Arial, sans-serif;
  }

  .tarjeta {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 16px;
  }

  label {
    display: block;
    margin-top: 8px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    box-sizing: border-box;
  }

  button {
    margin: 8px 6px 8px 0;
    padding: 8px 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
  }

  .mensaje {
    font-weight: bold;
  }

  .paginador {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }

  .paginador button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>