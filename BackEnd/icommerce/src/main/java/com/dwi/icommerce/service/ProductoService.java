package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

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

    public List<Producto> GetAllProductsByGenero(Long id_Genero){
        return productoRepository.findByGeneroId(id_Genero);
    }

    public Optional<List<Producto>> GetAllProductsFilter(Long genero, Long temporada, Long marca, Long categoria){
        return productoRepository.findFiltered(genero, temporada, marca, categoria);
    }

    public void deleteProduct(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto updateProduct(Long id, Producto datosNuevos) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no existe"));

        productoExistente.setNombre(datosNuevos.getNombre());
        productoExistente.setDescripcion(datosNuevos.getDescripcion());
        productoExistente.setPrecio(datosNuevos.getPrecio());

        return productoRepository.save(productoExistente);
    }
}