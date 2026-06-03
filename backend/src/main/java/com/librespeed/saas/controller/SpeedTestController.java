package com.librespeed.saas.controller;

import com.librespeed.saas.model.SpeedTest;
import com.librespeed.saas.service.SpeedTestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/network")
@CrossOrigin(origins = "*")
public class SpeedTestController {

    private final SpeedTestService service;

    public SpeedTestController(SpeedTestService service) {
        this.service = service;
    }

    @PostMapping("/test/start")
    public ResponseEntity<Map<String, Object>> startTest(HttpServletRequest request) {
        String testId = UUID.randomUUID().toString();
        Map<String, Object> response = new HashMap<>();
        response.put("testId", testId);
        response.put("status", "Initialized");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test/save")
    public ResponseEntity<SpeedTest> saveTest(@Valid @RequestBody SaveTestRequest request) {
        SpeedTest test = SpeedTest.builder()
                .userId(request.getUserId())
                .downloadSpeed(request.getDownloadSpeed())
                .uploadSpeed(request.getUploadSpeed())
                .ping(request.getPing())
                .jitter(request.getJitter())
                .ipAddress(request.getIpAddress())
                .ispName(request.getIspName())
                .deviceInfo(request.getDeviceInfo())
                .connectionInfo(request.getConnectionInfo())
                .build();

        SpeedTest saved = service.saveTest(test);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/history")
    public ResponseEntity<List<SpeedTest>> getHistory(
            @RequestParam(value = "userId", defaultValue = "guest-user-123") String userId) {
        List<SpeedTest> history = service.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics(
            @RequestParam(value = "userId", defaultValue = "guest-user-123") String userId) {
        Map<String, Object> analytics = service.getAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/latest")
    public ResponseEntity<SpeedTest> getLatest(
            @RequestParam(value = "userId", defaultValue = "guest-user-123") String userId) {
        return service.getLatest(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public static class SaveTestRequest {
        private String userId = "guest-user-123";
        private Double downloadSpeed;
        private Double uploadSpeed;
        private Double ping;
        private Double jitter;
        private String ipAddress;
        private String ispName;
        private String deviceInfo;
        private String connectionInfo;

        // Getters and Setters
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

        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

        public String getIspName() { return ispName; }
        public void setIspName(String ispName) { this.ispName = ispName; }

        public String getDeviceInfo() { return deviceInfo; }
        public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

        public String getConnectionInfo() { return connectionInfo; }
        public void setConnectionInfo(String connectionInfo) { this.connectionInfo = connectionInfo; }
    }
}
