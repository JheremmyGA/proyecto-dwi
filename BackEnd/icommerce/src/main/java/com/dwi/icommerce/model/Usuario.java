package com.dwi.icommerce.model;

import com.dwi.icommerce.DTO.RegisterUsuarioDTO;
import com.dwi.icommerce.Enums.UsuarioRol;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_usuario")
    public Long id;
    public String nombre;
    public String apellido;
    public String correo;
    @Column(name="contrasena")
    public String contraseña;
    @Enumerated(EnumType.STRING)
    public UsuarioRol rol;

    public Usuario(String apellido, String contraseña, String correo, Long id, String nombre, UsuarioRol rol) {
        this.apellido = apellido;
        this.contraseña = contraseña;
        this.correo = correo;
        this.id = id;
        this.nombre = nombre;
        this.rol = rol;
    }

    public Usuario(RegisterUsuarioDTO usuarioDTO){
        this.nombre = usuarioDTO.getNombre();
        this.apellido = usuarioDTO.getApellido();
        this.correo = usuarioDTO.getCorreo();
        this.contraseña = usuarioDTO.getContraseña();
        this.rol = UsuarioRol.Cliente;
    }

    public Usuario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public UsuarioRol getRol() {
        return rol;
    }

    public void setRol(UsuarioRol rol) {
        this.rol = rol;
    }
}
