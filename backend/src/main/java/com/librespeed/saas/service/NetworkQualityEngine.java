package com.librespeed.saas.service;

import com.librespeed.saas.model.NetworkQuality;
import org.springframework.stereotype.Service;

@Service
public class NetworkQualityEngine {

    /**
     * Calculates network score (0-100) and grade (Excellent, Good, Fair, Poor) based on metrics.
     * Weights:
     * - Download speed (35%)
     * - Upload speed (25%)
     * - Ping (25%)
     * - Jitter (15%)
     */
    public NetworkQuality calculateScore(double download, double upload, double ping, double jitter) {
        // Safe boundaries
        download = Math.max(0, download);
        upload = Math.max(0, upload);
        ping = Math.max(0, ping);
        jitter = Math.max(0, jitter);

        // 1. Download Speed Score (0-100)
        // <= 5 Mbps is poor (0-30 points). Benchmark for 100% is 100 Mbps.
        double dlScore;
        if (download <= 5) {
            dlScore = (download / 5.0) * 30.0;
        } else if (download >= 100) {
            dlScore = 100.0;
        } else {
            dlScore = 30.0 + ((download - 5) / 95.0) * 70.0;
        }

        // 2. Upload Speed Score (0-100)
        // <= 2 Mbps is poor (0-30 points). Benchmark for 100% is 50 Mbps.
        double ulScore;
        if (upload <= 2) {
            ulScore = (upload / 2.0) * 30.0;
        } else if (upload >= 50) {
            ulScore = 100.0;
        } else {
            ulScore = 30.0 + ((upload - 2) / 48.0) * 70.0;
        }

        // 3. Ping Score (0-100)
        // Lower is better. Ping <= 15ms is perfect (100). >= 150ms is bad (0).
        double pingScore;
        if (ping <= 15) {
            pingScore = 100.0;
        } else if (ping >= 150) {
            pingScore = 0.0;
        } else {
            pingScore = 100.0 - ((ping - 15.0) / 135.0) * 100.0;
        }

        // 4. Jitter Score (0-100)
        // Lower is better. Jitter <= 2ms is perfect (100). >= 30ms is bad (0).
        double jitterScore;
        if (jitter <= 2) {
            jitterScore = 100.0;
        } else if (jitter >= 30) {
            jitterScore = 0.0;
        } else {
            jitterScore = 100.0 - ((jitter - 2.0) / 28.0) * 100.0;
        }

        // Combined Score
        double finalScoreVal = (0.35 * dlScore) + (0.25 * ulScore) + (0.25 * pingScore) + (0.15 * jitterScore);
        int score = (int) Math.round(finalScoreVal);
        score = Math.clamp(score, 0, 100);

        String grade;
        if (score >= 90) {
            grade = "Excellent";
        } else if (score >= 70) {
            grade = "Good";
        } else if (score >= 50) {
            grade = "Fair";
        } else {
            grade = "Poor";
        }

        return new NetworkQuality(score, grade);
    }
}
