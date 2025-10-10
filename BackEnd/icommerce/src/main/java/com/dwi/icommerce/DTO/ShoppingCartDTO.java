package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.ProductMain;

public class ShoppingCartDTO {
    public String nombre,marca,sku;
    public int cantidad;
    public Double precio;

    public ShoppingCartDTO(ProductMain producto, int cantidad){
        this.nombre = producto.getProducto().getNombre();
        this.marca = (producto.getProducto().getMarca() != null)? producto.getProducto().getMarca().getNombre() : "";
        this.sku = producto.getSKU();
        this.precio = producto.getProducto().getPrecio();
        this.cantidad = cantidad;
    }
}
