package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.ProductMain;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ShoppingCartDTO {
    public int cantidad;
    public String color;
    @JsonProperty("id_unico")
    public String sku;
    @JsonProperty("imagen")
    public String image_path;
    public String nombre;
    @JsonProperty("nombre_ui")
    public String nombreExtended;
    public Double precio;
    public String talla;

    public ShoppingCartDTO(ProductMain producto, int cantidad){
        this.cantidad = cantidad;
        this.color = producto.getColor().getNombre();
        this.talla = producto.getTalla().getNombre();
        this.sku = producto.getSKU();
        this.image_path = producto.getPreviewImage();
        this.nombre = producto.getProducto().getNombre();
        this.nombreExtended = this.nombre + " - " + this.color + " / " + this.talla;
        this.precio = producto.getProducto().getPrecio();
    }
}
