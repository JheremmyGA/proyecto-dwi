package com.dwi.icommerce.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name="talla")
public class Talla {
    public Long id_talla;
    public String nombre;

    public Talla(){

    }

    public Talla (Long id_talla, String nombre){
        this.id_talla = id_talla;
        this.nombre = nombre;
    }

    public Long getId_talla() {
        return id_talla;
    }

    public String getNombre() {
        return nombre;
    }

    public void SetNombre(String nombre) {
        this.nombre = nombre;
    }
}
