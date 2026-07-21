package com.espe.product.dto;

import com.espe.product.entity.Producto;
import java.util.List;

// content       -> los productos de la página actual
// page          -> número de la página actual (empieza en 0)
// size          -> cantidad de registros solicitados por página
// totalElements -> cantidad total de productos activos en la base de datos
// totalPages    -> cantidad total de páginas disponibles según size
public record PaginaProductoResponse(
        List<Producto> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {}