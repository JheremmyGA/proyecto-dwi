package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;

import javax.swing.text.StyledEditorKit.BoldAction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.InventarioGroupRequestDTO;
import com.dwi.icommerce.DTO.InventarioItemDetailResponseDTO;
import com.dwi.icommerce.DTO.InventarioItemUpdateStockDTO;
import com.dwi.icommerce.model.Marca;
import com.dwi.icommerce.service.InventarioService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService service; 

    public InventarioController(InventarioService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InventarioItemDetailResponseDTO>> getAllDetails() {
        return ResponseEntity.status(HttpStatus.OK).body(service.GetAllDetails());
    }
    
    
    @PostMapping("/create")
    public ResponseEntity<?> CreateGroupItem(@RequestBody InventarioGroupRequestDTO data) {
        service.CreateGroupItem(data);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update/stock")
    public ResponseEntity<Boolean> UpdateStock(@RequestBody InventarioItemUpdateStockDTO data) {
        Boolean action = service.UpdateStock(data.SKU, data.NewStock);

        if (!action) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

    @DeleteMapping("/delete/{SKU}")
    public ResponseEntity<?> DeleteMarca(@PathVariable String SKU) {
        service.DeleteItem(SKU);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
