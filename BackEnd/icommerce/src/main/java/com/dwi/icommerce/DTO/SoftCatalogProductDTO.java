package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.Producto;

public class SoftCatalogProductDTO {
    public final Long id;
    public final String nombre, marca;
    public final Double precio;

    public SoftCatalogProductDTO(Long id, String nombre, String marca, Double precio) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.precio = precio;
    }

    public SoftCatalogProductDTO(Producto producto){
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.marca = (producto.getMarca()!= null) ? producto.getMarca().getNombre() : "";
        this.precio = producto.getPrecio();
    }
}
