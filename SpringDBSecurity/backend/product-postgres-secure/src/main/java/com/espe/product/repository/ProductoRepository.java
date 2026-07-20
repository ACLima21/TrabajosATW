package com.espe.product.repository;

import com.espe.product.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
}