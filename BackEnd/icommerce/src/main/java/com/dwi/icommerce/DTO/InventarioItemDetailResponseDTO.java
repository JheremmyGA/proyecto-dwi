package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.ProductMain;

public class InventarioItemDetailResponseDTO {
    public String nombre;
    public String marca;
    public String temporada;
    public String categoria;
    public String genero;
    public Double precio;
    public String SKU;
    public String talla;
    public String color;
    public int cantidad;
    public String PreviewImage;

    public InventarioItemDetailResponseDTO(ProductMain productMain){
        nombre = productMain.getProducto().getNombre();
        marca = productMain.getProducto().getMarca().getNombre();
        temporada = productMain.getProducto().getTemporada().getNombre();
        categoria = productMain.getProducto().getCategoria().getNombre();
        genero = productMain.getProducto().getGenero().getNombre();
        precio =productMain.getProducto().getPrecio();
        SKU = productMain.getSKU();
        talla = productMain.getTalla().getNombre();
        color = productMain.getColor().getNombre();
        cantidad = productMain.getStock();
        PreviewImage = productMain.getPreviewImage();
    }
}
