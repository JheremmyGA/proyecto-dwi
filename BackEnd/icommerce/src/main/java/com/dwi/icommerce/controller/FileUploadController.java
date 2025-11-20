package com.dwi.icommerce.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final String BASE_URL = "http://localhost:9530";

    @Value("${file.upload-dir}")
    private String uploadDir;  // ahora solo "uploads"

    @PostMapping("/image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Debe seleccionar un archivo.");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);

            // crear si no existe
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // generar nombre único
            String extension = getFileExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID().toString() + "." + extension;

            // ruta final
            Path filePath = uploadPath.resolve(fileName);

            // guardar archivo
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL pública
            String publicUrl = BASE_URL + "/images/uploads/" + fileName;

            return ResponseEntity.ok(publicUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la imagen: " + e.getMessage());
        }
    }

    private String getFileExtension(String fileName) {
        int pos = fileName.lastIndexOf('.');
        return (pos == -1) ? "" : fileName.substring(pos + 1);
    }
}
