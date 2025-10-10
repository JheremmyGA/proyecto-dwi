package com.dwi.icommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="talla")
public class Talla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_talla")
    public Long id;
    public String nombre;

    public Talla(){

    }

    public Talla (Long id_talla, String nombre){
        this.id = id_talla;
        this.nombre = nombre;
    }

    public Long getId_talla() {
        return id;
    }

    public void setId_talla(Long id_talla) {
        this.id = id_talla;
    }

    public String getNombre() {
        return nombre;
    }

    public void SetNombre(String nombre) {
        this.nombre = nombre;
    }
}
