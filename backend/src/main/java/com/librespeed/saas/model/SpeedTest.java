package com.librespeed.saas.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "speed_tests")
public class SpeedTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "download_speed", nullable = false)
    private Double downloadSpeed;

    @Column(name = "upload_speed", nullable = false)
    private Double uploadSpeed;

    @Column(nullable = false)
    private Double ping;

    @Column(nullable = false)
    private Double jitter;

    @Column(name = "network_quality", nullable = false, length = 50)
    private String networkQuality;

    @Column(nullable = false)
    private Integer score = 0;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "isp_name")
    private String ispName;

    @Column(name = "device_info")
    private String deviceInfo;

    @Column(name = "connection_info")
    private String connectionInfo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Default Constructor
    public SpeedTest() {
        this.createdAt = OffsetDateTime.now();
    }

    // All Arguments Constructor
    public SpeedTest(Long id, String userId, Double downloadSpeed, Double uploadSpeed, Double ping, Double jitter,
                     String networkQuality, Integer score, String ipAddress, String ispName, String deviceInfo,
                     String connectionInfo, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.downloadSpeed = downloadSpeed;
        this.uploadSpeed = uploadSpeed;
        this.ping = ping;
        this.jitter = jitter;
        this.networkQuality = networkQuality;
        this.score = score != null ? score : 0;
        this.ipAddress = ipAddress;
        this.ispName = ispName;
        this.deviceInfo = deviceInfo;
        this.connectionInfo = connectionInfo;
        this.createdAt = createdAt != null ? createdAt : OffsetDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Double getDownloadSpeed() { return downloadSpeed; }
    public void setDownloadSpeed(Double downloadSpeed) { this.downloadSpeed = downloadSpeed; }

    public Double getUploadSpeed() { return uploadSpeed; }
    public void setUploadSpeed(Double uploadSpeed) { this.uploadSpeed = uploadSpeed; }

    public Double getPing() { return ping; }
    public void setPing(Double ping) { this.ping = ping; }

    public Double getJitter() { return jitter; }
    public void setJitter(Double jitter) { this.jitter = jitter; }

    public String getNetworkQuality() { return networkQuality; }
    public void setNetworkQuality(String networkQuality) { this.networkQuality = networkQuality; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getIspName() { return ispName; }
    public void setIspName(String ispName) { this.ispName = ispName; }

    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

    public String getConnectionInfo() { return connectionInfo; }
    public void setConnectionInfo(String connectionInfo) { this.connectionInfo = connectionInfo; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    // Builder Class
    public static SpeedTestBuilder builder() {
        return new SpeedTestBuilder();
    }

    public static class SpeedTestBuilder {
        private Long id;
        private String userId;
        private Double downloadSpeed;
        private Double uploadSpeed;
        private Double ping;
        private Double jitter;
        private String networkQuality;
        private Integer score;
        private String ipAddress;
        private String ispName;
        private String deviceInfo;
        private String connectionInfo;
        private OffsetDateTime createdAt;

        SpeedTestBuilder() {}

        public SpeedTestBuilder id(Long id) { this.id = id; return this; }
        public SpeedTestBuilder userId(String userId) { this.userId = userId; return this; }
        public SpeedTestBuilder downloadSpeed(Double downloadSpeed) { this.downloadSpeed = downloadSpeed; return this; }
        public SpeedTestBuilder uploadSpeed(Double uploadSpeed) { this.uploadSpeed = uploadSpeed; return this; }
        public SpeedTestBuilder ping(Double ping) { this.ping = ping; return this; }
        public SpeedTestBuilder jitter(Double jitter) { this.jitter = jitter; return this; }
        public SpeedTestBuilder networkQuality(String networkQuality) { this.networkQuality = networkQuality; return this; }
        public SpeedTestBuilder score(Integer score) { this.score = score; return this; }
        public SpeedTestBuilder ipAddress(String ipAddress) { this.ipAddress = ipAddress; return this; }
        public SpeedTestBuilder ispName(String ispName) { this.ispName = ispName; return this; }
        public SpeedTestBuilder deviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; return this; }
        public SpeedTestBuilder connectionInfo(String connectionInfo) { this.connectionInfo = connectionInfo; return this; }
        public SpeedTestBuilder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SpeedTest build() {
            return new SpeedTest(id, userId, downloadSpeed, uploadSpeed, ping, jitter, networkQuality, score, ipAddress, ispName, deviceInfo, connectionInfo, createdAt);
        }
    }
}
