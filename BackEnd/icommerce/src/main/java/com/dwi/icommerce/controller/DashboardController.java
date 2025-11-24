package com.dwi.icommerce.controller;

import com.dwi.icommerce.DTO.DashboardDailySaleDTO;
import com.dwi.icommerce.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/ventas-por-dia")
    public ResponseEntity<List<DashboardDailySaleDTO>> getVentasPorDia() {
        List<DashboardDailySaleDTO> ventasDiarias = dashboardService.getVentasIndividuales();
        return ResponseEntity.ok(ventasDiarias);
    }
}