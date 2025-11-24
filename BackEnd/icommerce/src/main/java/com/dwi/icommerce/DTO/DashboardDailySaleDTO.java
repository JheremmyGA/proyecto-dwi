package com.dwi.icommerce.DTO;

import java.time.LocalDate;

public class DashboardDailySaleDTO {

    private LocalDate fecha;
    private Double monto;

    // Constructor usado por JPQL y también útil para el servicio
    public DashboardDailySaleDTO(LocalDate fecha, Double monto) {
        this.fecha = fecha;
        this.monto = monto;
    }

    // Constructor por defecto
    public DashboardDailySaleDTO() {
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Double getMonto() {
        return monto;
    }

    public void setMonto(Double monto) {
        this.monto = monto;
    }
}
