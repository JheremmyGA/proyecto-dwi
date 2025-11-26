package com.dwi.icommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>{


    @Query("SELECT ts FROM Producto ts " +
           "WHERE (:genero IS NULL OR ts.genero.id = :genero) " +
           "AND (:temporada IS NULL OR ts.temporada.id = :temporada) " +
           "AND (:marca IS NULL OR ts.marca.id = :marca) " +
           "AND (:categoria IS NULL OR ts.categoria.id = :categoria)")
    Optional<List<Producto>> findFiltered(@Param("genero") Long genero,
                                  @Param("temporada") Long temporada,
                                  @Param("marca") Long marca,
                                  @Param("categoria") Long categoria);

    @Query("SELECT p FROM Producto p " +
       "JOIN FETCH p.genero g " +         // Cargar Genero
       "JOIN FETCH p.temporada t " +      // Cargar Temporada
       "JOIN FETCH p.marca m " +          // Cargar Marca
       "JOIN FETCH p.categoria c " +      // Cargar Categoria
       "WHERE g.id = :id_genero")
    public List<Producto> findByGeneroId(@Param("id_genero") Long id_genero);
    public List<Producto> findByTemporadaNombre(String nombre);
}
