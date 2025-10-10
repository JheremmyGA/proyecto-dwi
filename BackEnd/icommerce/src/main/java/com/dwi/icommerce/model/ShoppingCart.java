package com.dwi.icommerce.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="carrito")
public class ShoppingCart {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_carrito")
    private Long id;
    @ManyToOne
    @JoinColumn(name="id_usuario")
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name="id_tallastock")
    private ProductMain productoMain;
    private int cantidad;
    private Double precio;
    @Column(name="fecha_agregado")
    private LocalDateTime fecha;

    public ShoppingCart() {
    }

    public ShoppingCart(int cantidad, LocalDateTime fecha, Long id, Double precio, ProductMain productoMain, Usuario usuario) {
        this.cantidad = cantidad;
        this.fecha = fecha;
        this.id = id;
        this.precio = precio;
        this.productoMain = productoMain;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public ProductMain getProductoMain() {
        return productoMain;
    }

    public void setProductoMain(ProductMain productoMain) {
        this.productoMain = productoMain;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
}
