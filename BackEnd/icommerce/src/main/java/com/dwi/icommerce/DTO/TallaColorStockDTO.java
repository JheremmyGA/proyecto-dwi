package com.dwi.icommerce.DTO;

import com.dwi.icommerce.model.ProductMain;

public class TallaColorStockDTO {
    public final Long id;
    public final String talla;
    public final String color;
    public final int stock;
    public final String sku;
    
    public TallaColorStockDTO(){
        id = null;
        talla = "";
        color = "";
        sku = "";
        stock = 0;
    }

    public TallaColorStockDTO(ProductMain product_main) {
        this.id = product_main.id;
        this.talla = (product_main.getTalla() != null)? product_main.getTalla().getNombre() : "";
        this.color = (product_main.getColor() != null)? product_main.getColor().getNombre() : "";
        this.stock = product_main.getStock();
        this.sku = product_main.getSKU();
    }
}
