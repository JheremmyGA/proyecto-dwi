package com.dwi.icommerce.DTO;

import java.util.List;

public class InventarioGroupRequestDTO {
    public String nombre;
    public String marca;
    public String temporada;
    public String categoria;
    public String genero;
    public Double precio;
    public String PreviewImage;

    public List<InventarioItemRequestDTO> items;
}
