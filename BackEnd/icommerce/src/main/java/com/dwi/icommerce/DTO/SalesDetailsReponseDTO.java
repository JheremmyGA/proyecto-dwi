package com.dwi.icommerce.DTO;

import java.time.format.DateTimeFormatter;

import com.dwi.icommerce.model.OrderDetails;
import com.fasterxml.jackson.annotation.JsonProperty;

public class SalesDetailsReponseDTO {
    public String fecha;
    @JsonProperty("boleta")
    public String id;
    @JsonProperty("producto")
    public String nombreProducto;
    @JsonProperty("unid")
    public int cantidad;
    @JsonProperty("costo")
    public Double precio_unitario;

    public SalesDetailsReponseDTO(OrderDetails oDetails){
        this.cantidad = oDetails.getCantidad();
        DateTimeFormatter salidaFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        this.fecha = oDetails.getPedido().getFecha().format(salidaFormatter);
        this.id = String.format("%05d", oDetails.getPedido().getId());
        this.nombreProducto = String.format("%s %s",oDetails.getProducto().getProducto().getNombre(), oDetails.getProducto().getTalla().getNombre());
        this.precio_unitario = oDetails.getPrecio();
    }
}
