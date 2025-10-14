package com.dwi.icommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_producto")
    private Long id;

    private String nombre;
    private String descripcion;
    private Double precio;
    @Column(name="preview_image_path")
    private String PreviewImage;
    //registros de ingresos y salidas de productos en una tabla aparte

    @ManyToOne
    @JoinColumn(name="id_categoria")
    private Categoria categoria;
    @ManyToOne
    @JoinColumn(name="id_temporada")
    private Temporada temporada;
    @ManyToOne
    @JoinColumn(name="id_genero")
    private Genero genero;
    @ManyToOne
    @JoinColumn(name="id_marca")
    private Marca marca;

    public Producto(Long id_producto, String nombre, String descripcion, Double precio, String PreviewImage, Categoria categoria,
            Temporada temporada, Genero genero, Marca marca) {
        this.id = id_producto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.PreviewImage = PreviewImage;
        this.categoria = categoria;
        this.temporada = temporada;
        this.genero = genero;
        this.marca = marca;
    }

    public Producto() {
    }

    public Long getId() {
        return id;
    }

    public String getPreviewImage() {
        return PreviewImage;
    }

    public void setPreviewImage(String previewImage) {
        PreviewImage = previewImage;
    }

    public void setId(Long id_producto) {
        this.id = id_producto;
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

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Temporada getTemporada() {
        return temporada;
    }

    public void setTemporada(Temporada temporada) {
        this.temporada = temporada;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
    
}
