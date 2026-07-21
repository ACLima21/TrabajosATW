package com.espe.product.service;

import com.espe.product.dto.PaginaProductoResponse;
import com.espe.product.entity.Producto;
import com.espe.product.repository.ProductoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Producto> listar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return repository.findAll();
        }
        return repository.findByNombreContainingIgnoreCase(nombre.trim());
    }

    @Transactional(readOnly = true)
    public PaginaProductoResponse listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> resultado = repository.findByActivoTrue(pageable);

        return new PaginaProductoResponse(
                resultado.getContent(),
                resultado.getNumber(),
                resultado.getSize(),
                resultado.getTotalElements(),
                resultado.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public Producto buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional
    public Producto crear(Producto producto) {
        if (repository.existsByNombreIgnoreCase(producto.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un producto con ese nombre");
        }
        producto.setId(null);
        return repository.save(producto);
    }

    @Transactional
    public Producto actualizar(Long id, Producto datos) {
        Producto actual = buscar(id);
        boolean cambioNombre = !actual.getNombre()
                .equalsIgnoreCase(datos.getNombre());
        if (cambioNombre && repository.existsByNombreIgnoreCase(datos.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Ya existe un producto con ese nombre");
        }
        actual.setNombre(datos.getNombre());
        actual.setDescripcion(datos.getDescripcion());
        actual.setPrecio(datos.getPrecio());
        actual.setStock(datos.getStock());
        actual.setActivo(datos.getActivo());
        return repository.save(actual);
    }

    // Eliminación LÓGICA: el producto no se borra de PostgreSQL,
    // solo se cambia su columna activo a false. Por eso deja de aparecer
    // en el listado paginado (findByActivoTrue), pero sigue existiendo
    // en la tabla productos.
    @Transactional
    public void eliminar(Long id) {
        Producto producto = buscar(id);
        producto.setActivo(false);
        repository.save(producto);
    }
}