package com.librespeed.saas.repository;

import com.librespeed.saas.model.SpeedTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpeedTestRepository extends JpaRepository<SpeedTest, Long> {

    List<SpeedTest> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<SpeedTest> findFirstByUserIdOrderByCreatedAtDesc(String userId);
}
