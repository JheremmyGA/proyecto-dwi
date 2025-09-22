package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.CategoriaDTO;
import com.dwi.icommerce.model.Categoria;
import com.dwi.icommerce.service.CategoriaService;



@RestController
@RequestMapping("/api/categoria")
public class CategoriaController {

    @Autowired
    private final CategoriaService categoria_service;

    public CategoriaController(CategoriaService serviceCategoria){
        this.categoria_service = serviceCategoria;
    }

    @GetMapping
    public List<Categoria> GetAllCategorias() {
        return categoria_service.GetAllCategorias();
    }    

    @GetMapping("/{id}")
    public CategoriaDTO getMethodName(@PathVariable Long id) {
        Optional<Categoria> categoria = categoria_service.GetCategoriaById(id);
        if(categoria.isEmpty()) return new CategoriaDTO();

        return new CategoriaDTO(categoria.get());
    }

    @PostMapping
    public CategoriaDTO CreateCategoria(@RequestBody CategoriaDTO entity) {
        // falta validar que esa categoria no exista
        Categoria new_categoria = new Categoria();
            new_categoria.setNombre(entity.getNombre());
            new_categoria.setDescripcion(entity.getDescripcion());

        return new CategoriaDTO(categoria_service.CreateCategoria(new_categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDTO> UpdateCategoria(@PathVariable Long id, @RequestBody CategoriaDTO newCategoriaDTO) {
        Optional<Categoria> categoria_encontrada = categoria_service.GetCategoriaById(id);

        if(categoria_encontrada.isPresent()){
            Categoria cat_actualizado = categoria_encontrada.get();
            cat_actualizado.setNombre(newCategoriaDTO.getNombre());
            cat_actualizado.setDescripcion(newCategoriaDTO.getDescripcion());
            return new ResponseEntity<>(new CategoriaDTO(categoria_service.CreateCategoria(cat_actualizado)), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteCategoria(@PathVariable Long id) {
        Optional<Categoria> categoria_encontrada = categoria_service.GetCategoriaById(id);

        if(categoria_encontrada.isPresent()){
            return new ResponseEntity<>(categoria_service.DeleteCategoria(categoria_encontrada.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
