package com.amazonclone.repository;

import com.amazonclone.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByIdentifierAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
            String identifier, OtpToken.OtpPurpose purpose);
    
    @Query("SELECT COUNT(o) FROM OtpToken o WHERE o.identifier = :identifier AND o.purpose = :purpose AND o.createdAt >= :since")
    long countRecentOtps(String identifier, OtpToken.OtpPurpose purpose, LocalDateTime since);
    
    void deleteByExpiresAtBeforeAndIsUsedTrue(LocalDateTime before);
}
