package com.dwi.icommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="color")
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_color")
    public Long id;
    public String nombre;
    
    public Color() {
    }

    public Color(Long id_color, String nombre) {
        this.id = id_color;
        this.nombre = nombre;
    }

    public Color(String nombre) {
        this.nombre = nombre;
    }

    public Long getId_color() {
        return id;
    }

    public void setId_color(Long id_color) {
        this.id = id_color;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
