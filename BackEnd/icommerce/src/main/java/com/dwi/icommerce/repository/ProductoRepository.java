package com.dwi.icommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>{

}
