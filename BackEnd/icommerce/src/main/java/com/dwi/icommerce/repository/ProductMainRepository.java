package com.dwi.icommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.ProductMain;

@Repository
public interface ProductMainRepository extends JpaRepository<ProductMain, Long> {
    public Optional<ProductMain> findBySKU(String SKU);
    public Optional<List<ProductMain>> findByProductoId(Long id);
}
