package com.dwi.icommerce.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name= "temporada")
public class Temporada {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id_temporada;
    private String nombre;
    
    public Temporada() {
    }

    public Temporada(String nombre) {
        this.nombre = nombre;
    }

    public Temporada(long id_temporada, String nombre) {
        this.id_temporada = id_temporada;
        this.nombre = nombre;
    }

    public long getId_temporada() {
        return id_temporada;
    }

    public void setId_temporada(long id_temporada) {
        this.id_temporada = id_temporada;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
