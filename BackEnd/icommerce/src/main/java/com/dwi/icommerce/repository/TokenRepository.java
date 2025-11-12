package com.dwi.icommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dwi.icommerce.model.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    public List<Token> findAllValidIsFalseOrRevokedIsFalseByUsuarioId(Long userId);
}
