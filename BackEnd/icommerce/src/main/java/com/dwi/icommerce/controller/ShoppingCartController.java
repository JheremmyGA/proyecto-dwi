package com.dwi.icommerce.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dwi.icommerce.DTO.ShoppingCartDTO;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.service.ShoppingCartService;
import com.dwi.icommerce.service.UsuarioService;

@RestController
@RequestMapping("/api/carrito")
public class ShoppingCartController {
    @Autowired
    public final ShoppingCartService service;
    @Autowired
    public final UsuarioService usuarioService;

    public ShoppingCartController(ShoppingCartService service, UsuarioService usuarioService){
        this.service = service;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<ShoppingCartDTO>> getShoppingCartByUsuario(@PathVariable Long id) {
        Optional<List<ShoppingCart>> dataFind = service.FindByUsuario(id);
        if(dataFind.isEmpty()) ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        
        List<ShoppingCartDTO> listaFinal = dataFind.get().stream()
            .map(a -> new ShoppingCartDTO(a.getProductoMain(),a.getCantidad()))
            .collect(Collectors.toList());
        
        return ResponseEntity.status(HttpStatus.FOUND).body(listaFinal);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ShoppingCartDTO> InsertShoppingCartByUsuario(@PathVariable Long id, 
                                                                       @RequestParam(required = true) Long idProductoMain,
                                                                       @RequestParam(required = true) int cantidad) {
        Optional<Usuario> usuarioFind = usuarioService.findUsuario(id);

        if(usuarioFind.isPresent()){
            ShoppingCart dataInserted = service.InsertShoppingCartByUsuario(usuarioFind.get(), idProductoMain, cantidad);
            return ResponseEntity.status(HttpStatus.OK).body(new ShoppingCartDTO(dataInserted.getProductoMain(),dataInserted.getCantidad()));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
