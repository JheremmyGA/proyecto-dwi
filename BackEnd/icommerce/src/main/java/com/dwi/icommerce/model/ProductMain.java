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
@Table(name="tallastock")
public class ProductMain {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id_tallastock")
    public Long id;
    @ManyToOne
    @JoinColumn(name="id_producto")
    public Producto producto;
    @ManyToOne
    @JoinColumn(name="id_talla")
    public Talla talla;
    @ManyToOne
    @JoinColumn(name="id_color")
    public Color color;
    public Long stock;
    public String SKU;

    public ProductMain() {
    }

    public ProductMain(String SKU, Color color, Long id_Product, Producto producto, Long stock, Talla talla) {
        this.SKU = SKU;
        this.color = color;
        this.id = id_Product;
        this.producto = producto;
        this.stock = stock;
        this.talla = talla;
    }

    public Long getId() {
        return id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Talla getTalla() {
        return talla;
    }

    public void setTalla(Talla talla) {
        this.talla = talla;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Long getStock() {
        return stock;
    }

    public void setStock(Long stock) {
        this.stock = stock;
    }

    public String getSKU() {
        return SKU;
    }

    public void setSKU(String sKU) {
        SKU = sKU;
    }
}
