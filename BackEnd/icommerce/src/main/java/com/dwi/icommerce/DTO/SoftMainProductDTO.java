package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.ProductMain;

public class SoftMainProductDTO {
    public String sku, nombre, color;
    public Double precio;

    public SoftMainProductDTO(String _sku, String nombre, String color, Double precio) {
        this.sku = _sku;
        this.color = color;
        this.nombre = nombre;
        this.precio = precio;
    }

    public SoftMainProductDTO(ProductMain productoMain){
        this.sku = productoMain.getSKU();
        this.nombre = productoMain.getProducto().getNombre();
        this.color = productoMain.getColor().getNombre();
        this.precio = productoMain.getProducto().getPrecio();
    }
}
