import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Producto } from './models/producto';
import { ProductoService } from './services/producto';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  usuario = 'admin';
  clave = 'admin123lima';

  productos: Producto[] = [];

  // Estado de paginación
  paginaActual = 0;
  tamanioPagina = 5;
  totalPaginas = 0;
  totalElementos = 0;

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    activo: true
  };

  editando = false;
  idEditando: number | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarPagina(0);
  }

  cargarPagina(page: number): void {
    this.productoService
      .listarPaginado(page, this.tamanioPagina, this.usuario, this.clave)
      .subscribe({
        next: (data) => {
          this.productos = data.content;
          this.paginaActual = data.page;
          this.totalPaginas = data.totalPages;
          this.totalElementos = data.totalElements;
        },
        error: (error) => {
          console.error('Error al listar productos paginados', error);
        }
      });
  }

  paginaAnterior(): void {
    if (this.paginaActual > 0) {
      this.cargarPagina(this.paginaActual - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas - 1) {
      this.cargarPagina(this.paginaActual + 1);
    }
  }

  guardarProducto(): void {
    if (this.editando && this.idEditando !== null) {
      this.productoService.actualizar(
        this.idEditando,
        this.producto,
        this.usuario,
        this.clave
      ).subscribe({
        next: () => {
          this.cargarPagina(this.paginaActual);
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al actualizar producto', error);
        }
      });
    } else {
      this.productoService.crear(
        this.producto,
        this.usuario,
        this.clave
      ).subscribe({
        next: () => {
          this.cargarPagina(this.paginaActual);
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al crear producto', error);
        }
      });
    }
  }

  editarProducto(producto: Producto): void {
    this.editando = true;
    this.idEditando = producto.id ?? null;

    this.producto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      activo: producto.activo
    };
  }

  eliminarProducto(id: number | undefined): void {
    if (id === undefined) {
      console.error('No se puede eliminar un producto sin id');
      return;
    }

    this.productoService.eliminar(id, this.usuario, this.clave).subscribe({
      next: () => {
        // Si al eliminar el único producto de la última página esta queda vacía,
        // retrocedemos una página para no mostrar una tabla vacía innecesariamente.
        const eraUltimoDeLaPagina = this.productos.length === 1 && this.paginaActual > 0;
        const paginaDestino = eraUltimoDeLaPagina ? this.paginaActual - 1 : this.paginaActual;
        this.cargarPagina(paginaDestino);
      },
      error: (error) => {
        console.error('Error al eliminar producto', error);
      }
    });
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.idEditando = null;

    this.producto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      activo: true
    };
  }
}