package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.service.ProductMainService;


@RestController
@RequestMapping("/api/productMain")
public class ProductMainController {
    @Autowired
    private final ProductMainService service;
    
    public ProductMainController(ProductMainService service){
        this.service = service;
    }

    @GetMapping
    public List<ProductMain> getAllProductos(){
        return service.getAllProducts();
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public ProductMain getProducto(@PathVariable Long id) {
        return service.GetProduct(id);
    }

    // Crear nuevo producto
    @PostMapping
    public ResponseEntity<ProductMain> createProducto(@RequestBody ProductMain producto) {
        // falta validar que esa categoria no exista
        Optional<ProductMain> productFind = service.GetProductMainBySKU(producto.getSKU());
        if(productFind.isPresent()) ResponseEntity.status(HttpStatus.CONFLICT).build();

        ProductMain nuevoColor = service.Create(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoColor);
    }

    @PutMapping("/{id}")
    public ProductMain actualizarProducto(@PathVariable Long id, @RequestBody ProductMain producto) {
        return service.updateProduct(id, producto);
    }
}
