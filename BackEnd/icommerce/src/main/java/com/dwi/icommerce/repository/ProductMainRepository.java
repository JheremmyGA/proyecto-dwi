package com.dwi.icommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.ProductMain;

@Repository
public interface ProductMainRepository extends JpaRepository<ProductMain, Long> {
    public Optional<ProductMain> findBySKU(String SKU);
    public List<ProductMain> findByProductoGeneroId(Long id_genero);

    @Query("SELECT ts FROM ProductMain ts " +
           "JOIN ts.producto p " +
           "WHERE (:genero IS NULL OR p.genero.id = :genero) " +
           "AND (:temporada IS NULL OR p.temporada.id = :temporada) " +
           "AND (:marca IS NULL OR p.marca.id = :marca) " +
           "AND (:categoria IS NULL OR p.categoria.id = :categoria)")
    Optional<List<ProductMain>> findFiltered(@Param("genero") Long genero,
                                  @Param("temporada") Long temporada,
                                  @Param("marca") Long marca,
                                  @Param("categoria") Long categoria);
}
