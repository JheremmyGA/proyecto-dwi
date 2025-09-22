package com.dwi.icommerce.DTO;
import com.dwi.icommerce.model.Categoria;

public class CategoriaDTO {

    private Long id_categoria;
    private String nombre;
    private String descripcion;

    public CategoriaDTO(){

    }

    public CategoriaDTO(Categoria categoria){
        this.id_categoria = categoria.getId_categoria();
        this.nombre = categoria.getNombre();
        this.descripcion = categoria.getDescripcion();
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Long getId_categoria() {
        return id_categoria;
    }
}
