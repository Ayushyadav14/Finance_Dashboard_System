package com.finance.service;

import com.finance.dto.DashboardSummary;
import com.finance.dto.RecordResponse;
import com.finance.model.FinanceRecord;
import com.finance.repository.FinanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinanceRecordRepository recordRepository;

    public DashboardSummary getSummary() {
        BigDecimal totalIncome = recordRepository.getTotalIncome();
        BigDecimal totalExpenses = recordRepository.getTotalExpenses();

        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        List<Object[]> categoryRaw = recordRepository.getCategoryTotals();
        List<Map<String, Object>> byCategory = new ArrayList<>();
        for (Object[] row : categoryRaw) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("category", row[0]);
            entry.put("total", row[1]);
            byCategory.add(entry);
        }

        List<Object[]> trendRaw = recordRepository.getMonthlyTrend();
        Map<String, Map<String, Object>> trendMap = new LinkedHashMap<>();
        for (Object[] row : trendRaw) {
            String month = (String) row[0];
            String type = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            trendMap.computeIfAbsent(month, k -> {
                Map<String, Object> m = new HashMap<>();
                m.put("month", k);
                m.put("income", BigDecimal.ZERO);
                m.put("expense", BigDecimal.ZERO);
                return m;
            });
            trendMap.get(month).put(type, amount);
        }

        List<FinanceRecord> recentRaw = recordRepository
                .findRecentRecords(PageRequest.of(0, 5));
        List<RecordResponse> recentRecords = recentRaw.stream().map(r -> {
            RecordResponse dto = new RecordResponse();
            dto.setId(r.getId());
            dto.setAmount(r.getAmount());
            dto.setType(r.getType());
            dto.setCategory(r.getCategory());
            dto.setDate(r.getDate());
            dto.setNotes(r.getNotes());
            return dto;
        }).toList();

        DashboardSummary summary = new DashboardSummary();
        summary.setTotalIncome(totalIncome);
        summary.setTotalExpenses(totalExpenses);
        summary.setNetBalance(totalIncome.subtract(totalExpenses));
        summary.setByCategory(byCategory);
        summary.setRecentRecords(recentRecords);
        summary.setMonthlyTrend(new ArrayList<>(trendMap.values()));
        return summary;
    }
}