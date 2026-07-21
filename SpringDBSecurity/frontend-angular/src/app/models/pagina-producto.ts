import { Producto } from './producto';

export interface PaginaProducto {
  content: Producto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}