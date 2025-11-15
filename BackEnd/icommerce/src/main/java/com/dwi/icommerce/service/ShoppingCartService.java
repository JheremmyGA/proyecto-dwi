package com.dwi.icommerce.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.model.Usuario;
import com.dwi.icommerce.repository.ProductMainRepository;
import com.dwi.icommerce.repository.ShoppingCartRepository;

@Service
public class ShoppingCartService {

    @Autowired
    public ShoppingCartRepository repository;
    @Autowired
    public ProductMainRepository productMainRepository;

    public Optional<List<ShoppingCart>> FindByUsuario(Long id){
        return repository.findByUsuarioId(id);
    }

    public ShoppingCart InsertShoppingCartByUsuario(Usuario usuario, String sku, int cantidad){
        Optional<ShoppingCart> data = repository.findByUsuarioIdAndProductoMainSKU(usuario.getId(), sku);
        ShoppingCart dataFind = new ShoppingCart();

        if(data.isPresent()){
            dataFind = data.get();
            dataFind.setCantidad(cantidad);
            repository.save(dataFind);
            return dataFind;
        }

        Optional<ProductMain> productoMain = productMainRepository.findBySKU(sku);
        dataFind.setCantidad(cantidad);
        dataFind.setUsuario(usuario);
        dataFind.setFecha(LocalDateTime.now());
        dataFind.setProductoMain(productoMain.get());
        dataFind.setPrecio(productoMain.get().getProducto().getPrecio());
        repository.save(dataFind);
        return dataFind;
    }

    public void DeleteItem(Usuario usuario,  String sku){
        Optional<ShoppingCart> data = repository.findByUsuarioIdAndProductoMainSKU(usuario.getId(), sku);
        repository.delete(data.get());
    }
}
