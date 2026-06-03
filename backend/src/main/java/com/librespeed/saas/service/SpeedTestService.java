package com.librespeed.saas.service;

import com.librespeed.saas.model.NetworkQuality;
import com.librespeed.saas.model.SpeedTest;
import com.librespeed.saas.repository.SpeedTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SpeedTestService {

    private final SpeedTestRepository repository;
    private final NetworkQualityEngine qualityEngine;

    public SpeedTestService(SpeedTestRepository repository, NetworkQualityEngine qualityEngine) {
        this.repository = repository;
        this.qualityEngine = qualityEngine;
    }

    @Transactional
    public SpeedTest saveTest(SpeedTest test) {
        // Calculate network quality score and grade
        NetworkQuality quality = qualityEngine.calculateScore(
                test.getDownloadSpeed(),
                test.getUploadSpeed(),
                test.getPing(),
                test.getJitter()
        );
        test.setNetworkQuality(quality.grade());
        return repository.save(test);
    }

    public List<SpeedTest> getHistory(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<SpeedTest> getLatest(String userId) {
        return repository.findFirstByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> getAnalytics(String userId) {
        List<SpeedTest> tests = repository.findByUserIdOrderByCreatedAtDesc(userId);

        Map<String, Object> analytics = new HashMap<>();

        if (tests.isEmpty()) {
            analytics.put("averageDownload", 0.0);
            analytics.put("averageUpload", 0.0);
            analytics.put("averagePing", 0.0);
            analytics.put("bestSpeed", null);
            analytics.put("worstSpeed", null);
            analytics.put("trends", Map.of(
                    "daily", List.of(),
                    "weekly", List.of(),
                    "monthly", List.of()
            ));
            return analytics;
        }

        // Calculations
        double avgDl = tests.stream().mapToDouble(SpeedTest::getDownloadSpeed).average().orElse(0.0);
        double avgUl = tests.stream().mapToDouble(SpeedTest::getUploadSpeed).average().orElse(0.0);
        double avgPing = tests.stream().mapToDouble(SpeedTest::getPing).average().orElse(0.0);

        SpeedTest bestTest = tests.stream()
                .max(Comparator.comparing(SpeedTest::getDownloadSpeed))
                .orElse(null);

        SpeedTest worstTest = tests.stream()
                .min(Comparator.comparing(SpeedTest::getDownloadSpeed))
                .orElse(null);

        analytics.put("averageDownload", Math.round(avgDl * 100.0) / 100.0);
        analytics.put("averageUpload", Math.round(avgUl * 100.0) / 100.0);
        analytics.put("averagePing", Math.round(avgPing * 100.0) / 100.0);
        analytics.put("bestSpeed", bestTest);
        analytics.put("worstSpeed", worstTest);

        // Group trends
        analytics.put("trends", Map.of(
                "daily", calculateDailyTrends(tests),
                "weekly", calculateWeeklyTrends(tests),
                "monthly", calculateMonthlyTrends(tests)
        ));

        return analytics;
    }

    private List<Map<String, Object>> calculateDailyTrends(List<SpeedTest> tests) {
        // Group by LocalDate
        Map<LocalDate, List<SpeedTest>> grouped = tests.stream()
                .collect(Collectors.groupingBy(t -> t.getCreatedAt().toLocalDate()));

        List<LocalDate> sortedDates = grouped.keySet().stream().sorted().toList();
        List<Map<String, Object>> list = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (LocalDate date : sortedDates) {
            List<SpeedTest> dayTests = grouped.get(date);
            double avgDl = dayTests.stream().mapToDouble(SpeedTest::getDownloadSpeed).average().orElse(0.0);
            double avgUl = dayTests.stream().mapToDouble(SpeedTest::getUploadSpeed).average().orElse(0.0);
            double avgPing = dayTests.stream().mapToDouble(SpeedTest::getPing).average().orElse(0.0);

            Map<String, Object> point = new HashMap<>();
            point.put("label", date.format(formatter));
            point.put("download", Math.round(avgDl * 10.0) / 10.0);
            point.put("upload", Math.round(avgUl * 10.0) / 10.0);
            point.put("ping", Math.round(avgPing * 10.0) / 10.0);
            list.add(point);
        }
        return list;
    }

    private List<Map<String, Object>> calculateWeeklyTrends(List<SpeedTest> tests) {
        // Define week field based on default locale configuration
        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        // We group by a key representing Year + Week
        Map<String, List<SpeedTest>> grouped = tests.stream()
                .collect(Collectors.groupingBy(t -> {
                    LocalDate d = t.getCreatedAt().toLocalDate();
                    int year = d.getYear();
                    int week = d.get(weekFields.weekOfWeekBasedYear());
                    return String.format("%d-W%02d", year, week);
                }));

        List<String> sortedKeys = grouped.keySet().stream().sorted().toList();
        List<Map<String, Object>> list = new ArrayList<>();

        for (String key : sortedKeys) {
            List<SpeedTest> weekTests = grouped.get(key);
            double avgDl = weekTests.stream().mapToDouble(SpeedTest::getDownloadSpeed).average().orElse(0.0);
            double avgUl = weekTests.stream().mapToDouble(SpeedTest::getUploadSpeed).average().orElse(0.0);
            double avgPing = weekTests.stream().mapToDouble(SpeedTest::getPing).average().orElse(0.0);

            Map<String, Object> point = new HashMap<>();
            // Format label as "Week 23, 2026"
            String[] parts = key.split("-W");
            point.put("label", "Wk " + parts[1] + ", " + parts[0]);
            point.put("download", Math.round(avgDl * 10.0) / 10.0);
            point.put("upload", Math.round(avgUl * 10.0) / 10.0);
            point.put("ping", Math.round(avgPing * 10.0) / 10.0);
            list.add(point);
        }
        return list;
    }

    private List<Map<String, Object>> calculateMonthlyTrends(List<SpeedTest> tests) {
        Map<YearMonth, List<SpeedTest>> grouped = tests.stream()
                .collect(Collectors.groupingBy(t -> YearMonth.from(t.getCreatedAt().toLocalDate())));

        List<YearMonth> sortedMonths = grouped.keySet().stream().sorted().toList();
        List<Map<String, Object>> list = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (YearMonth ym : sortedMonths) {
            List<SpeedTest> monthTests = grouped.get(ym);
            double avgDl = monthTests.stream().mapToDouble(SpeedTest::getDownloadSpeed).average().orElse(0.0);
            double avgUl = monthTests.stream().mapToDouble(SpeedTest::getUploadSpeed).average().orElse(0.0);
            double avgPing = monthTests.stream().mapToDouble(SpeedTest::getPing).average().orElse(0.0);

            Map<String, Object> point = new HashMap<>();
            point.put("label", ym.format(formatter));
            point.put("download", Math.round(avgDl * 10.0) / 10.0);
            point.put("upload", Math.round(avgUl * 10.0) / 10.0);
            point.put("ping", Math.round(avgPing * 10.0) / 10.0);
            list.add(point);
        }
        return list;
    }
}
