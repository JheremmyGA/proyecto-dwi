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

import com.dwi.icommerce.model.Temporada;
import com.dwi.icommerce.service.TemporadaService;


@RestController
@RequestMapping("/api/temporada")
public class TemporadaController {

    @Autowired
    private final TemporadaService temporada_service;

    public TemporadaController(TemporadaService serviceTemporada){
        this.temporada_service = serviceTemporada;
    }

    @GetMapping
    public List<Temporada> GetAll() {
        return temporada_service.GetAll();
    }    

    @GetMapping("/{id}")
    public Temporada getMethodName(@PathVariable Long id) {
        Optional<Temporada> temporada = temporada_service.GetById(id);
        if(!temporada.isPresent()) return new Temporada();

        return temporada.get();
    }

    @PostMapping
    public Temporada CreateCategoria(@RequestBody Temporada entity) {
        // falta validar que esa categoria no exista
        Optional<Temporada> temporada = temporada_service.GetById(entity.getId_temporada());
        if(temporada.isPresent()) return new Temporada();

        return temporada_service.Create(entity);
    }

    @PutMapping
    public ResponseEntity<Temporada> UpdateCategoria(@RequestBody Temporada newDTO) {
        if(newDTO.getId_temporada() < 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<Temporada> categoria_encontrada = temporada_service.GetById(newDTO.getId_temporada());

        if(categoria_encontrada.isPresent()){
            Temporada temp_actualizado = categoria_encontrada.get();
            temp_actualizado.setNombre(newDTO.getNombre());
            return new ResponseEntity<>(temporada_service.Create(temp_actualizado), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteCategoria(@PathVariable Long id) {
        Optional<Temporada> temp_encontrada = temporada_service.GetById(id);

        if(temp_encontrada.isPresent()){
            return new ResponseEntity<>(temporada_service.Delete(temp_encontrada.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
