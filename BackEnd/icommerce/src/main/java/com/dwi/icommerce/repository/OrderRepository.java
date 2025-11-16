package com.dwi.icommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

}
