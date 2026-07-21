<script setup>
import { ref, onMounted } from 'vue'
import {
  listarProductosPaginado,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from './services/productoService'

const usuario = ref('admin')
const clave = ref('admin123lima')

const productos = ref([])
const editando = ref(false)
const idEditando = ref(null)
const mensaje = ref('')

// Estado de paginación
const paginaActual = ref(0)
const totalPaginas = ref(0)
const totalElementos = ref(0)
const TAMANIO_PAGINA = 5

function productoVacio() {
  return {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    activo: true
  }
}

const formulario = ref(productoVacio())

onMounted(() => {
  cargarPagina(0)
})

async function cargarPagina(page) {
  try {
    const data = await listarProductosPaginado(page, TAMANIO_PAGINA, usuario.value, clave.value)
    productos.value = data.content
    paginaActual.value = data.page
    totalPaginas.value = data.totalPages
    totalElementos.value = data.totalElements
    mensaje.value = `Página ${data.page + 1} de ${data.totalPages} (${data.totalElements} productos)`
  } catch (error) {
    manejarError(error)
  }
}

function paginaAnterior() {
  if (paginaActual.value > 0) {
    cargarPagina(paginaActual.value - 1)
  }
}

function paginaSiguiente() {
  if (paginaActual.value < totalPaginas.value - 1) {
    cargarPagina(paginaActual.value + 1)
  }
}

async function guardar() {
  const producto = {
    ...formulario.value,
    precio: Number(formulario.value.precio),
    stock: Number(formulario.value.stock)
  }

  try {
    if (editando.value && idEditando.value !== null) {
      await actualizarProducto(idEditando.value, producto, usuario.value, clave.value)
      mensaje.value = 'Producto actualizado correctamente.'
    } else {
      await crearProducto(producto, usuario.value, clave.value)
      mensaje.value = 'Producto registrado correctamente.'
    }

    limpiarFormulario()
    await cargarPagina(paginaActual.value)
  } catch (error) {
    manejarError(error)
  }
}

function seleccionar(producto) {
  formulario.value = { ...producto }
  idEditando.value = producto.id
  editando.value = true
}

async function eliminar(producto) {
  try {
    await eliminarProducto(producto.id, usuario.value, clave.value)
    mensaje.value = 'Producto eliminado correctamente.'

    // Si era el único producto visible de una página que no es la primera,
    // retrocedemos una página para no dejar la tabla vacía.
    const eraUltimoDeLaPagina = productos.value.length === 1 && paginaActual.value > 0
    const paginaDestino = eraUltimoDeLaPagina ? paginaActual.value - 1 : paginaActual.value
    await cargarPagina(paginaDestino)
  } catch (error) {
    manejarError(error)
  }
}

function limpiarFormulario() {
  formulario.value = productoVacio()
  editando.value = false
  idEditando.value = null
}

function manejarError(error) {
  if (error.status === 401) {
    mensaje.value = 'Credenciales incorrectas.'
  } else if (error.status === 403) {
    mensaje.value = 'El usuario autenticado requiere rol ADMIN para esta acción.'
  } else if (error.status === 409) {
    mensaje.value = 'Ya existe un producto con ese nombre.'
  } else {
    mensaje.value = error.message || 'Error inesperado.'
  }
}
</script>

<template>
  <main class="contenedor">
    <h1>CRUD de productos - Vue</h1>

    <section class="tarjeta">
      <h2>Credenciales</h2>
      <label>Usuario</label>
      <input v-model="usuario" />

      <label>Contraseña</label>
      <input type="password" v-model="clave" />
    </section>

    <section class="tarjeta">
      <h2>{{ editando ? 'Editar producto' : 'Registrar producto' }}</h2>

      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="formulario.nombre" required />

        <label>Descripción</label>
        <input v-model="formulario.descripcion" required />

        <label>Precio</label>
        <input type="number" v-model="formulario.precio" required />

        <label>Stock</label>
        <input type="number" v-model="formulario.stock" required />

        <label>
          <input type="checkbox" v-model="formulario.activo" />
          Activo
        </label>

        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button type="button" @click="limpiarFormulario">Limpiar</button>
      </form>
    </section>

    <section class="tarjeta">
      <h2>Listado de productos</h2>

      <p class="mensaje">{{ mensaje }}</p>

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
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.id }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.precio }}</td>
            <td>{{ producto.stock }}</td>
            <td>{{ producto.activo ? 'Sí' : 'No' }}</td>
            <td>
              <button @click="seleccionar(producto)">Editar</button>
              <button @click="eliminar(producto)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="paginador">
        <button @click="paginaAnterior" :disabled="paginaActual === 0">
          Anterior
        </button>

        <span>
          Página {{ paginaActual + 1 }} de {{ totalPaginas || 1 }} ({{ totalElementos }} productos)
        </span>

        <button @click="paginaSiguiente" :disabled="paginaActual >= totalPaginas - 1">
          Siguiente
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
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