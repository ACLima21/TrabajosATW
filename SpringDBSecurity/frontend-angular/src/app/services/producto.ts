import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Producto } from '../models/producto';
import { PaginaProducto } from '../models/pagina-producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8081/api/productos';

  constructor(private http: HttpClient) {}

  private crearHeaders(usuario: string, clave: string): HttpHeaders {
    const token = btoa(`${usuario}:${clave}`);

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    });
  }

  // Consume GET /api/productos/paginado?page=&size=
  listarPaginado(
    page: number,
    size: number,
    usuario: string,
    clave: string
  ): Observable<PaginaProducto> {
    const headers = this.crearHeaders(usuario, clave);

    return this.http.get<PaginaProducto>(
      `${this.apiUrl}/paginado?page=${page}&size=${size}`,
      { headers }
    );
  }

  crear(producto: Producto, usuario: string, clave: string): Observable<Producto> {
    const headers = this.crearHeaders(usuario, clave);

    return this.http.post<Producto>(
      this.apiUrl,
      producto,
      { headers }
    );
  }

  actualizar(
    id: number,
    producto: Producto,
    usuario: string,
    clave: string
  ): Observable<Producto> {
    const headers = this.crearHeaders(usuario, clave);

    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      producto,
      { headers }
    );
  }

  eliminar(id: number, usuario: string, clave: string): Observable<void> {
    const headers = this.crearHeaders(usuario, clave);

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers }
    );
  }
}