package com.dwi.icommerce.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.model.ShoppingCart;
import com.dwi.icommerce.repository.ProductMainRepository;

import jakarta.transaction.Transactional;

@Service
public class ProductMainService {

    @Autowired
    public ProductMainRepository repository;

    public List<ProductMain> getAllProducts() {
        return repository.findAll();
    }

    public ProductMain saveProduct(ProductMain producto) {
        return repository.save(producto);
    }

    public ProductMain GetProduct(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Optional<List<ProductMain>> GetAllMainProductsByProduct(Long id){
        return repository.findByProductoId(id);
    }

    public Optional<ProductMain> GetProductMainBySKU(String SKU){
        return repository.findBySKU(SKU);
    }

    public ProductMain Create(ProductMain new_pProductMain){
        if(new_pProductMain.getSKU() != "") {
            return repository.save(new_pProductMain);
        }
        return new ProductMain();
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    public ProductMain updateProduct(Long id, ProductMain datosNuevos) {
        ProductMain productoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto con ID " + id + " no existe"));

        productoExistente.setTalla(datosNuevos.getTalla());
        productoExistente.setColor(datosNuevos.getColor());
        productoExistente.setStock(datosNuevos.getStock());
        productoExistente.setSKU(datosNuevos.getSKU());

        return repository.save(productoExistente);
    }

    public boolean UpdateStock(String SKU, int NewStock){
        Optional<ProductMain> product = repository.findBySKU(SKU);

        if (product.isEmpty()) {
            return false;
        }

        ProductMain newProduct = product.get();
        newProduct.setStock(NewStock);

        repository.save(newProduct);

        return true;
    }

    public void deleteProduct(String SKU){
        Optional<ProductMain> productMain = repository.findBySKU(SKU);

        if (productMain.isEmpty()) {
            return;
        }

        repository.delete(productMain.get());
    }

    @Transactional
    public void TakeOrder(List<ShoppingCart> orderdetails){
        for (ShoppingCart shoppingCart : orderdetails) {
            Long idStock = shoppingCart.getProductoMain().getId();
            int cantidad = shoppingCart.getCantidad();

            ProductMain stockItem = repository.findByIdWithLock(idStock).orElseThrow(() -> new RuntimeException("Stock item ID: " + idStock + " no encontrado."));

            int currentStock = stockItem.getStock();

            if (currentStock < cantidad) {
                throw new RuntimeException("Stock insuficiente para ID: " + idStock + ". Disponible: " + currentStock);
            }

            stockItem.setStock(currentStock - cantidad);
            repository.save(stockItem); 
        }
    }
}
