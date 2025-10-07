package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.SoftMainProductDTO;
import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.service.ProductMainService;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    @Autowired
    private final ProductMainService service;

    public CatalogController(ProductMainService service){
        this.service = service;
    }

    // <editor-fold desc="GETS DE SOFTMAINPRODUCTDTO">
    @GetMapping("/all/genero/{id}")
    public ResponseEntity<List<SoftMainProductDTO>> getProductoByGenero(@PathVariable Long id) {
        List<ProductMain> productsFind = service.GetAllProductMainsByGenero(id);
        if(productsFind.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftMainProductDTO> listaFinal = productsFind.stream()
            .map(a -> new SoftMainProductDTO(a))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.FOUND).body(listaFinal);
    }

    @GetMapping("/all/genero/filter")
    public ResponseEntity<List<SoftMainProductDTO>> getProductoFilter(@RequestParam(required = true) Long genero,
                                    @RequestParam(required = false) Long temporada,
                                    @RequestParam(required = false) Long marca,
                                    @RequestParam(required = false) Long categoria) {
        
        Optional<List<ProductMain>> productsFind = service.GetAllProductMainsFilter(genero, temporada, marca, categoria);
        if(productsFind.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftMainProductDTO> listaFinal = productsFind.get().stream()
            .map(a -> new SoftMainProductDTO(a))
            .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.FOUND).body(listaFinal);
    }
    
    // </editor-fold>
}
