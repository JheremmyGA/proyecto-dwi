package com.dwi.icommerce.model;

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
    private Long id_genero;
    private String nombre; 

    public Genero(Long id_genero, String nombre) {
        this.id_genero = id_genero;
        this.nombre = nombre;
    }

    public Genero() {
    }

    public Long getId_genero() {
        return id_genero;
    }

    public void setId_genero(Long id_genero) {
        this.id_genero = id_genero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
