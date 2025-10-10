package com.dwi.icommerce.DTO;

import java.util.List;
import com.dwi.icommerce.model.Producto;

public class ExtendedCatalogProductDTO {
    public final String nombre, marca;
    public final Double precio;
    public final List<TallaColorStockDTO> tallasColores;

    public ExtendedCatalogProductDTO(Producto producto, List<TallaColorStockDTO> tallaColorStock){
        this.nombre = producto.getNombre();
        this.marca = (producto.getMarca() != null)? producto.getMarca().getNombre() : "";
        this.precio = producto.getPrecio();
        this.tallasColores = tallaColorStock;
    }
}
