package com.dwi.icommerce.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.model.OrderDetails;
import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.repository.OrderDetailsRepository;
import com.dwi.icommerce.repository.ProductMainRepository;
import com.dwi.icommerce.repository.ProductoRepository;

@Service
public class ProductHighlightService {
    @Autowired
    public ProductoRepository productoRepository;
    @Autowired
    public OrderDetailsRepository orderDetailsRepository;
    @Autowired
    public ProductMainRepository productMainRepository;

    private static final int LIMIT = 4;

    public Optional<List<Producto>> GetBestSelling() {
        List<OrderDetails> details = orderDetailsRepository.findAll();

        if (details.isEmpty()) {
            return Optional.empty();
        }

        Map<Producto, Long> salesCount = details.stream()
            .map(OrderDetails::getProducto)
            .map(productMain -> productMain.getProducto())
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
            // Nota: Podrías usar Collectors.summingInt(detail -> detail.getCantidad()) para sumar la cantidad, 
            // pero el conteo simple de ítems es una métrica de "más vendido" común.

        // 3. Ordenar por conteo de ventas de forma descendente y tomar los 5 primeros.
        List<Producto> bestSellers = salesCount.entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .limit(LIMIT)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        return Optional.of(bestSellers);
    }

    public Optional<List<Producto>> GetLiquidation() {
        return Optional.ofNullable(productoRepository.findAll(PageRequest.of(0, LIMIT)).getContent()); 
    }

    public Optional<List<Producto>> GetTrending() {
        List<OrderDetails> details = orderDetailsRepository.findAll();

        if (details.isEmpty()) {
            return Optional.empty();
        }

        Map<Producto, Long> presenceCount = details.stream()
            .map(detail -> detail.getProducto().getProducto()) 
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));

        List<Producto> trendingProducts = presenceCount.entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .limit(LIMIT)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        return Optional.of(trendingProducts);
    }

    public Optional<List<Producto>> GetNews() {
        Pageable topFive = PageRequest.of(0, LIMIT, Sort.by("id").descending());
        List<Producto> newsProducts = productoRepository.findAll(topFive).getContent();
        
        return Optional.ofNullable(newsProducts);
    }
}
