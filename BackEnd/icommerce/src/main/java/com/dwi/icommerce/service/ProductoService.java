package com.dwi.icommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.repository.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAllProducts() {
        return productoRepository.findAll();
    }

    public Producto saveProduct(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto GetProduct(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void deleteProduct(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto updateProduct(Long id, Producto datosNuevos) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no existe"));

        productoExistente.setNombre(datosNuevos.getNombre());
        productoExistente.setPrecio(datosNuevos.getPrecio());

        return productoRepository.save(productoExistente);
    }
}
