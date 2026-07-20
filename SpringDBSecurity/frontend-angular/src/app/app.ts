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
  clave = 'lima123';

  productos: Producto[] = [];

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
    this.listarProductos();
  }

  listarProductos(): void {
    this.productoService.listar(this.usuario, this.clave).subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al listar productos', error);
      }
    });
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
          this.listarProductos();
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
          this.listarProductos();
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
        this.listarProductos();
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