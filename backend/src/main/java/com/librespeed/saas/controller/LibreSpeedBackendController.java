package com.librespeed.saas.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.OutputStream;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/network/speedtest")
@CrossOrigin(origins = "*")
public class LibreSpeedBackendController {

    // Pre-allocated random chunk (1MB) of incompressible data
    private static final byte[] RANDOM_CHUNK = new byte[1024 * 1024];

    static {
        new SecureRandom().nextBytes(RANDOM_CHUNK);
    }

    @GetMapping("/garbage")
    public void getGarbage(@RequestParam(value = "ckSize", defaultValue = "4") int ckSize,
                           HttpServletResponse response) throws IOException {
        // Enforce safety limits
        if (ckSize <= 0) ckSize = 4;
        if (ckSize > 128) ckSize = 128; // Protect against OOM or abuse

        long totalSize = (long) ckSize * 1024 * 1024;

        response.setContentType("application/octet-stream");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=random.dat");
        response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(totalSize));
        // Force identity encoding to prevent HTTP compression (gzip, deflate, br) skewing measurements
        response.setHeader(HttpHeaders.CONTENT_ENCODING, "identity");
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
        response.setHeader(HttpHeaders.PRAGMA, "no-cache");

        try (OutputStream out = response.getOutputStream()) {
            for (int i = 0; i < ckSize; i++) {
                out.write(RANDOM_CHUNK);
            }
            out.flush();
        }
    }

    @RequestMapping(value = "/empty", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<Void> empty(HttpServletResponse response) {
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0");
        response.setHeader(HttpHeaders.PRAGMA, "no-cache");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_ENCODING, "identity")
                .build();
    }

    @GetMapping("/getIP")
    public ResponseEntity<Map<String, Object>> getIP(HttpServletRequest request) {
        String ip = getClientIp(request);

        String ispName = "Local Loopback";
        String country = "US";
        String org = "Private/Local Network";

        if (!isPrivateIp(ip)) {
            try {
                // Call external free API to fetch public IP and ISP details
                RestTemplate restTemplate = new RestTemplate();
                @SuppressWarnings("unchecked")
                Map<String, Object> geo = restTemplate.getForObject("http://ip-api.com/json/" + ip, Map.class);
                if (geo != null && "success".equals(geo.get("status"))) {
                    ispName = (String) geo.getOrDefault("isp", geo.getOrDefault("org", "Unknown ISP"));
                    country = (String) geo.getOrDefault("countryCode", "US");
                    org = (String) geo.getOrDefault("org", ispName);
                }
            } catch (Exception e) {
                ispName = "Public Connection";
                org = "Public Host";
            }
        } else {
            ispName = "Local Loopback (WiFi/Ethernet)";
            org = "Private LAN";
        }

        String processedString = ip + " - " + ispName + " (" + country + ")";
        
        Map<String, Object> response = new HashMap<>();
        response.put("processedString", processedString);
        
        Map<String, String> rawIspInfo = new HashMap<>();
        rawIspInfo.put("ip", ip);
        rawIspInfo.put("isp", ispName);
        rawIspInfo.put("org", org);
        rawIspInfo.put("country", country);
        response.put("rawIspInfo", rawIspInfo);

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate, max-age=0")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String[] headers = {
            "X-Forwarded-For",
            "X-Real-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_CLIENT_IP",
            "HTTP_X_FORWARDED_FOR"
        };
        for (String header : headers) {
            String value = request.getHeader(header);
            if (value != null && !value.isEmpty() && !"unknown".equalsIgnoreCase(value)) {
                return value.split(",")[0].trim();
            }
        }
        return request.getRemoteAddr();
    }

    private boolean isPrivateIp(String ip) {
        return ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.equals("::1") ||
               ip.startsWith("10.") || ip.startsWith("192.168.") ||
               (ip.startsWith("172.") && isPrivate172(ip));
    }

    private boolean isPrivate172(String ip) {
        try {
            String[] parts = ip.split("\\.");
            if (parts.length >= 2) {
                int secondOctet = Integer.parseInt(parts[1]);
                return secondOctet >= 16 && secondOctet <= 31;
            }
        } catch (NumberFormatException e) {
            // Ignore
        }
        return false;
    }
}
