package com.espe.product.controller;

import com.espe.product.entity.Producto;
import com.espe.product.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@SecurityRequirement(name = "basicAuth")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar o buscar productos por nombre")
    public List<Producto> listar(
            @RequestParam(required = false) String nombre) {
        return service.listar(nombre);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar un producto por id")
    public Producto buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    @PostMapping
    @Operation(summary = "Crear un producto; requiere ADMIN")
    public ResponseEntity<Producto> crear(
            @Valid @RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(producto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto; requiere ADMIN")
    public Producto actualizar(@PathVariable Long id,
                               @Valid @RequestBody Producto producto) {
        return service.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un producto; requiere ADMIN")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}