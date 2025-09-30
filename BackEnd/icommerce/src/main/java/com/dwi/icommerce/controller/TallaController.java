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

import com.dwi.icommerce.model.Talla;
import com.dwi.icommerce.service.TallaService;

@RestController
@RequestMapping("/api/talla")
public class TallaController {
    @Autowired
    private final TallaService talla_service;

    public TallaController(TallaService talla_service){
        this.talla_service = talla_service;
    }

    @GetMapping
    public List<Talla> GetAll() {
        return talla_service.GetAll();
    }    

    @GetMapping("/{id}")
    public Talla getMethodName(@PathVariable Long id) {
        Optional<Talla> tallaFind = talla_service.GetById(id);
        if(!tallaFind.isPresent()) return new Talla();

        return tallaFind.get();
    }

    @PostMapping
    public Talla CreateTalla(@RequestBody Talla entity) {
        // falta validar que esa categoria no exista
        //Optional<Talla> tallaFind = talla_service.GetById(entity.getId_talla());
        //if(tallaFind.isPresent()) return new Talla();

        return talla_service.Create(entity);
    }

    @PutMapping
    public ResponseEntity<Talla> UpdateTalla(@RequestBody Talla newDTO) {
        if(newDTO.getId_talla() < 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<Talla> tallaFind = talla_service.GetById(newDTO.getId_talla());

        if(tallaFind.isPresent()){
            Talla temp_actualizado = tallaFind.get();
            temp_actualizado.SetNombre(newDTO.getNombre());
            return new ResponseEntity<>(talla_service.Create(temp_actualizado), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteTalla(@PathVariable Long id) {
        Optional<Talla> tallaFind = talla_service.GetById(id);

        if(tallaFind.isPresent()){
            return new ResponseEntity<>(talla_service.Delete(tallaFind.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
