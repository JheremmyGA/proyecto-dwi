package com.dwi.icommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dwi.icommerce.DTO.InventarioGroupRequestDTO;
import com.dwi.icommerce.DTO.InventarioItemRequestDTO;
import com.dwi.icommerce.model.ProductMain;
import com.dwi.icommerce.model.Producto;
import com.dwi.icommerce.repository.CategoriaRepository;
import com.dwi.icommerce.repository.ColorRepository;
import com.dwi.icommerce.repository.GeneroRepository;
import com.dwi.icommerce.repository.MarcaRepository;
import com.dwi.icommerce.repository.TallaRepository;
import com.dwi.icommerce.repository.TemporadaRepository;

@Service
public class InventarioService {
    @Autowired
    private ProductoService productoService;
    @Autowired
    private ProductMainService productMainService;
    @Autowired
    private MarcaService marcaService;
    @Autowired
    private GeneroRepository generoRepository;
    @Autowired
    private CategoriaService categoriaService;
    @Autowired 
    private TemporadaService temporadaService;
    @Autowired 
    private TallaService tallaService;
    @Autowired 
    private ColorService colorService;

    public InventarioService(ProductoService productoService, ProductMainService productMainService, MarcaService marcaService, 
                            GeneroRepository generoRepository, CategoriaService categoriaService, TemporadaService temporadaService,
                            TallaService tallaService, ColorService colorService){
        this.productMainService = productMainService;
        this.productoService = productoService;
        this.marcaService = marcaService;
        this.generoRepository = generoRepository;
        this.categoriaService = categoriaService;
        this.temporadaService = temporadaService;
        this.tallaService = tallaService;
        this.colorService = colorService;
    }

    public void CreateGroupItem(InventarioGroupRequestDTO data){
        Producto product = productoService.saveProduct(ConvertToProduct(data));
        for (InventarioItemRequestDTO productDetailDto : data.items) {
            productMainService.saveProduct(ConvertToMainproduct(product,productDetailDto));
        }
    }

    private Producto ConvertToProduct(InventarioGroupRequestDTO dataDto){
        Producto newProduct = new Producto();
        newProduct.setNombre(dataDto.nombre);
        newProduct.setMarca(marcaService.findByNombre(dataDto.marca));
        newProduct.setTemporada(temporadaService.findByNombre(dataDto.temporada));
        newProduct.setCategoria(categoriaService.findByNombre(dataDto.categoria));
        newProduct.setGenero(generoRepository.findByNombre(dataDto.genero).get());
        newProduct.setPrecio(dataDto.precio);
        newProduct.setPreviewImage(dataDto.PreviewImage);
        return productoService.saveProduct(newProduct);
    }

    private ProductMain ConvertToMainproduct(Producto producto, InventarioItemRequestDTO dInventarioItemRequestDTO){
        ProductMain newProductMain = new ProductMain();
        newProductMain.setProducto(producto);
        newProductMain.setSKU(dInventarioItemRequestDTO.SKU);
        newProductMain.setTalla(tallaService.findByNombre(dInventarioItemRequestDTO.talla));
        newProductMain.setColor(colorService.findByNombre(dInventarioItemRequestDTO.color));
        newProductMain.setPreviewImage(dInventarioItemRequestDTO.PreviewImage);
        newProductMain.setStock(dInventarioItemRequestDTO.cantidad);
        return productMainService.saveProduct(newProductMain);
    }

}
