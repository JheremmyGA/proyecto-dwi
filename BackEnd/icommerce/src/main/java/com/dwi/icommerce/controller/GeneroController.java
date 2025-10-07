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

import com.dwi.icommerce.model.Genero;
import com.dwi.icommerce.service.GeneroService;



@RestController
@RequestMapping("/api/genero")
public class GeneroController {

    @Autowired
    private final GeneroService genero_service;

    public GeneroController(GeneroService serviceGenero){
        this.genero_service = serviceGenero;
    }

    @GetMapping
    public List<Genero> GetAll() {
        return genero_service.GetAll();
    }    

    @GetMapping("/{id}")
    public Genero getMethodName(@PathVariable Long id) {
        Optional<Genero> genero = genero_service.GetById(id);
        if(!genero.isPresent()) return new Genero();

        return genero.get();
    }

    @PostMapping
    public Genero CreateCategoria(@RequestBody Genero entity) {
        // falta validar que esa categoria no exista
        Optional<Genero> temporada = genero_service.GetByName(entity.getNombre());
        if(temporada.isPresent()) return new Genero();

        return genero_service.Create(entity);
    }

    @PutMapping
    public ResponseEntity<Genero> UpdateCategoria(@RequestBody Genero newDTO) {
        if(newDTO.getId_genero() < 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<Genero> genero_encontrada = genero_service.GetById(newDTO.getId_genero());

        if(genero_encontrada.isPresent()){
            Genero temp_actualizado = genero_encontrada.get();
            temp_actualizado.setNombre(newDTO.getNombre());
            temp_actualizado.setDescripcion(newDTO.getDescripcion());
            return new ResponseEntity<>(genero_service.Create(temp_actualizado), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteCategoria(@PathVariable Long id) {
        Optional<Genero> temp_encontrada = genero_service.GetById(id);

        if(temp_encontrada.isPresent()){
            return new ResponseEntity<>(genero_service.Delete(temp_encontrada.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
