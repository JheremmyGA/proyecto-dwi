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

import com.dwi.icommerce.model.Marca;
import com.dwi.icommerce.service.MarcaService;

@RestController
@RequestMapping("/api/marca")
public class MarcaController {

    @Autowired
    private final MarcaService marca_service;

    public MarcaController(MarcaService serviceMarca){
        this.marca_service = serviceMarca;
    }

    @GetMapping
    public List<Marca> GetAll() {
        return marca_service.GetAll();
    }    

    @GetMapping("/{id}")
    public Marca getMethodName(@PathVariable Long id) {
        Optional<Marca> marca = marca_service.GetById(id);
        if(!marca.isPresent()) return new Marca();

        return marca.get();
    }

    @PostMapping
    public Marca CreateCategoria(@RequestBody Marca entity) {
        // falta validar que esa categoria no exista
        Optional<Marca> marca = marca_service.GetById(entity.getId());
        if(marca.isPresent()) return new Marca();

        return marca_service.Create(entity);
    }

    @PutMapping
    public ResponseEntity<Marca> UpdateMarca(@RequestBody Marca newDTO) {
        if(newDTO.getId() < 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<Marca> marca_encontrada = marca_service.GetById(newDTO.getId());

        if(marca_encontrada.isPresent()){
            Marca temp_actualizado = marca_encontrada.get();
            temp_actualizado.setNombre(newDTO.getNombre());
            return new ResponseEntity<>(marca_service.Create(temp_actualizado), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteMarca(@PathVariable Long id) {
        Optional<Marca> temp_encontrada = marca_service.GetById(id);

        if(temp_encontrada.isPresent()){
            return new ResponseEntity<>(marca_service.Delete(temp_encontrada.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
