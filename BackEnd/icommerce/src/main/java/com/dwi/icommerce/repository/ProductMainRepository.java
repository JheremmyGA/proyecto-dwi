package com.dwi.icommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.ProductMain;

import jakarta.persistence.LockModeType;

@Repository
public interface ProductMainRepository extends JpaRepository<ProductMain, Long> {
    public Optional<ProductMain> findBySKU(String SKU);
    public Optional<List<ProductMain>> findByProductoId(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from ProductMain t where t.id = :id")
    Optional<ProductMain> findByIdWithLock(Long id);
}
