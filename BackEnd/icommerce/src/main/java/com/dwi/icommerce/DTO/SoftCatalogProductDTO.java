package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.Producto;

public class SoftCatalogProductDTO {
    public final Long id;
    public final String nombre;
    public final Double precio;
    public final String temporada;
    public final String categoria;
    public final String marca;
    public final String PreviewImage;

    public SoftCatalogProductDTO(Producto producto){
        this.id = producto.getId();
        this.nombre = producto.getNombre();
        this.marca = (producto.getMarca()!= null) ? producto.getMarca().getNombre() : "";
        this.precio = producto.getPrecio();
        this.temporada = (producto.getTemporada()!= null) ? producto.getTemporada().getNombre() : "";
        this.categoria = (producto.getCategoria()!= null) ? producto.getCategoria().getNombre() : "";
        this.PreviewImage = producto.getPreviewImage();
    }
}
