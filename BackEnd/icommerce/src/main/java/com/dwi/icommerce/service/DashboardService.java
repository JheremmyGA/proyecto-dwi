package com.dwi.icommerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.DashboardDailySaleDTO;
import com.dwi.icommerce.model.Order;
import com.dwi.icommerce.repository.OrderRepository;

@Service
public class DashboardService {

    @Autowired
    private final OrderRepository orderRepository;

    public DashboardService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    //public List<DashboardDailySaleDTO> getVentasDiarias() {
    //    return orderRepository.findTotalSalesGroupedByDay();
    //}

    public List<DashboardDailySaleDTO> getVentasIndividuales() {
        List<Order> orders = orderRepository.findAllByOrderByFechaAsc();

        return orders.stream()
            .map(o -> new DashboardDailySaleDTO(
                    o.getFecha() != null ? o.getFecha().toLocalDate() : null,
                    o.getTotal() != null ? o.getTotal().doubleValue() : 0.0
            ))
            .collect(Collectors.toList());
    }
}
