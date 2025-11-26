package com.dwi.icommerce.controller;

import java.util.ArrayList;
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

import com.dwi.icommerce.DTO.ExtendedCatalogProductDTO;
import com.dwi.icommerce.DTO.SoftCatalogProductDTO;
import com.dwi.icommerce.DTO.TallaColorStockDTO;
import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.service.ProductMainService;
import com.dwi.icommerce.service.ProductoService;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    @Autowired
    private final ProductoService productService;
    @Autowired
    private final ProductMainService productMainService;

    public CatalogController(ProductoService productService, ProductMainService productMainService){
        this.productService = productService;
        this.productMainService = productMainService;
    }

    // <editor-fold desc="GETS DE SOFTMAINPRODUCTDTO">
    @GetMapping("/all/genero/{id}")
    public ResponseEntity<List<SoftCatalogProductDTO>> getProductoByGenero(@PathVariable Long id) {
        List<Producto> productsFind = productService.GetAllProductsByGenero(id);
        if(productsFind.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftCatalogProductDTO> listaFinal = productsFind.stream()
            .map(a -> new SoftCatalogProductDTO(a))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.OK).body(listaFinal);
    }

    @GetMapping("/all/temporada")
    public ResponseEntity<List<SoftCatalogProductDTO>> getProductoByTemporada() {
        List<Producto> productsFind = productService.GetAllProductsByTemporada();
        if(productsFind.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftCatalogProductDTO> listaFinal = productsFind.stream()
            .map(a -> new SoftCatalogProductDTO(a))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.OK).body(listaFinal);
    }

    @GetMapping("/all/genero/filter")
    public ResponseEntity<List<SoftCatalogProductDTO>> getProductoFilter(@RequestParam(required = true) Long genero,
                                    @RequestParam(required = false) Long temporada,
                                    @RequestParam(required = false) Long marca,
                                    @RequestParam(required = false) Long categoria) {
        
        Optional<List<Producto>> productsFind = productService.GetAllProductsFilter(genero, temporada, marca, categoria);
        if(productsFind.isEmpty()) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<SoftCatalogProductDTO> listaFinal = productsFind.get().stream()
            .map(a -> new SoftCatalogProductDTO(a))
            .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(listaFinal);
    }
    
    // </editor-fold>

    @GetMapping("/producto/{id}")
    public ResponseEntity<ExtendedCatalogProductDTO> GetProduct(@PathVariable Long id) {
        Producto producto = productService.GetProduct(id);
        Optional<List<ProductMain>> productsMain = productMainService.GetAllMainProductsByProduct(id);
        
        List<TallaColorStockDTO> tallas_colores = new ArrayList<>();

        if(productsMain.isPresent()){
            tallas_colores = productsMain.get().stream()
            .map(a -> new TallaColorStockDTO(a))
            .collect(Collectors.toList());
        }

        return ResponseEntity.status(HttpStatus.OK).body(new ExtendedCatalogProductDTO(producto, tallas_colores));
    }
    
}
