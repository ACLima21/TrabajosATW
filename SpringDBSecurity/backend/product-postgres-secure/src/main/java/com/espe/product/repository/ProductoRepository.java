package com.espe.product.repository;

import com.espe.product.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCase(String nombre);

    // Trae solo los productos activos (activo = true), de forma paginada.
    // Al usar eliminación lógica, los productos "eliminados" (activo = false)
    // ya no aparecen en este listado, aunque siguen existiendo en PostgreSQL.
    Page<Producto> findByActivoTrue(Pageable pageable);
}