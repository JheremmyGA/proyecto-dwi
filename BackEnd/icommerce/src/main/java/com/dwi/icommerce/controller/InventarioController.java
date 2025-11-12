package com.dwi.icommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.InventarioGroupRequestDTO;
import com.dwi.icommerce.service.InventarioService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService service; 

    public InventarioController(InventarioService service){
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> CreateGroupItem(@RequestBody InventarioGroupRequestDTO data) {
        service.CreateGroupItem(data);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
