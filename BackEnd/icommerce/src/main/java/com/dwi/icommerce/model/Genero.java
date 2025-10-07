package com.dwi.icommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="genero")
public class Genero {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_genero")
    private Long id;
    private String nombre; 
    private String descripcion; 

    public Genero(Long id_genero, String nombre) {
        this.id = id_genero;
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Genero() {
    }

    public Long getId_genero() {
        return id;
    }

    public void setId_genero(Long id_genero) {
        this.id = id_genero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
