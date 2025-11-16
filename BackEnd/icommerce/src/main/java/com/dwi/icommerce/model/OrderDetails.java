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
@Table(name = "detallepedido")
public class OrderDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_detalle")
    private Long id;
    private int cantidad;
    @Column(name = "precio_unitario")
    private Double precio;
    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Order pedido;
    @ManyToOne
    @JoinColumn(name = "id_tallastock")
    private ProductMain producto;
    
    public OrderDetails(int cantidad, Double precio, Order pedido, ProductMain producto) {
        this.cantidad = cantidad;
        this.precio = precio;
        this.pedido = pedido;
        this.producto = producto;
    }

    public OrderDetails(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Order getPedido() {
        return pedido;
    }

    public void setPedido(Order pedido) {
        this.pedido = pedido;
    }

    public ProductMain getProducto() {
        return producto;
    }

    public void setProducto(ProductMain producto) {
        this.producto = producto;
    }

    
}
