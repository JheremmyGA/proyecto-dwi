package com.dwi.icommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.service.ProductoService;


@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private final ProductoService serviceProduct;
    
    public ProductoController(ProductoService serviceProduct){
        this.serviceProduct = serviceProduct;
    }

    @GetMapping
    public List<Producto> getAllProductos(){
        return serviceProduct.getAllProducts();
    }

     // Obtener producto por ID
    @GetMapping("/{id}")
    public Producto getProducto(@PathVariable Long id) {
        return serviceProduct.GetProduct(id);
    }

    // Crear nuevo producto
    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return serviceProduct.saveProduct(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return serviceProduct.updateProduct(id, producto);
    }
}
