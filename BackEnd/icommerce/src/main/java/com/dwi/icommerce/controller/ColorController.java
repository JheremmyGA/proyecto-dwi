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

import com.dwi.icommerce.model.Color;
import com.dwi.icommerce.service.ColorService;

@RestController
@RequestMapping("/api/color")
public class ColorController {

    @Autowired
    public final ColorService color_service;

    public ColorController(ColorService color_service){
        this.color_service = color_service;
    }

    @GetMapping
    public List<Color> GetAll() {
        return color_service.GetAll();
    }    

    @GetMapping("/{id}")
    public Color getMethodName(@PathVariable Long id) {
        Optional<Color> colorFind = color_service.GetById(id);
        if(!colorFind.isPresent()) return new Color();

        return colorFind.get();
    }

    @PostMapping
    public ResponseEntity<Color> CreateColor(@RequestBody Color entity) {
        // falta validar que esa categoria no exista
        Optional<Color> colorFind = color_service.GetByName(entity.getNombre());
        if(colorFind.isPresent()) return ResponseEntity.status(HttpStatus.CONFLICT).build();

        Color nuevoColor = color_service.Create(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoColor);
    }

    @PutMapping
    public ResponseEntity<Color> UpdateTalla(@RequestBody Color newDTO) {
        if(newDTO.getId_color() < 0) return new ResponseEntity<>(HttpStatus.NOT_FOUND);

        Optional<Color> colorFind = color_service.GetById(newDTO.getId_color());

        if(colorFind.isPresent()){
            Color temp_actualizado = colorFind.get();
            temp_actualizado.setNombre(newDTO.getNombre());
            return new ResponseEntity<>(color_service.Create(temp_actualizado), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> DeleteTalla(@PathVariable Long id) {
        Optional<Color> colorFind = color_service.GetById(id);

        if(colorFind.isPresent()){
            return new ResponseEntity<>(color_service.Delete(colorFind.get()), HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
