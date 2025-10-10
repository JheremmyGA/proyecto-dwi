package com.dwi.icommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dwi.icommerce.model.ShoppingCart;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    public Optional<List<ShoppingCart>> findByUsuarioId(Long id);
    public Optional<ShoppingCart> findByUsuarioIdAndProductoMainId(Long usuarioId, Long productoMainId);
}