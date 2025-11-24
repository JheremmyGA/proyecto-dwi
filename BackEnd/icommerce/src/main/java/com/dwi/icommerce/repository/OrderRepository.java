package com.dwi.icommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    //@Query("SELECT new com.dwi.icommerce.DTO.DashboardDailySaleDTO(CAST(o.fecha AS date), SUM(o.total)) " +
    //       "FROM Order o " +
    //       "GROUP BY CAST(o.fecha AS date) " +
    //       "ORDER BY CAST(o.fecha AS date) ASC")
    //public List<DashboardDailySaleDTO> findTotalSalesGroupedByDay();

    public List<Order> findAllByOrderByFechaAsc();
}
