package com.finance.service;

import com.finance.dto.CategoryTotal;
import com.finance.dto.DashboardSummary;
import com.finance.dto.MonthlyTrend;
import com.finance.dto.RecordResponse;
import com.finance.model.FinanceRecord;
import com.finance.repository.FinanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FinanceRecordRepository recordRepository;

    public DashboardSummary getSummary() {
        BigDecimal totalIncome = recordRepository.getTotalIncome();
        BigDecimal totalExpenses = recordRepository.getTotalExpenses();
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<Object[]> categoryResults = recordRepository.getCategoryTotals();
        List<CategoryTotal> byCategory = categoryResults.stream()
                .map(res -> new CategoryTotal((String) res[0], (BigDecimal) res[1]))
                .collect(Collectors.toList());

        List<FinanceRecord> recent = recordRepository.findTop5Recent(PageRequest.of(0, 5));
        List<RecordResponse> recentResponses = recent.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        List<Object[]> trendResults = recordRepository.getMonthlyTrend();
        Map<String, MonthlyTrend> trendMap = new HashMap<>();
        for (Object[] res : trendResults) {
            String month = (String) res[0];
            String type = (String) res[1];
            BigDecimal amount = (BigDecimal) res[2];

            MonthlyTrend trend = trendMap.getOrDefault(month, new MonthlyTrend(month, BigDecimal.ZERO, BigDecimal.ZERO));
            if ("income".equalsIgnoreCase(type)) {
                trend.setIncome(amount);
            } else if ("expense".equalsIgnoreCase(type)) {
                trend.setExpense(amount);
            }
            trendMap.put(month, trend);
        }
        List<MonthlyTrend> monthlyTrend = new ArrayList<>(trendMap.values());
        monthlyTrend.sort((a, b) -> a.getMonth().compareTo(b.getMonth()));

        return DashboardSummary.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netBalance(netBalance)
                .byCategory(byCategory)
                .recentRecords(recentResponses)
                .monthlyTrend(monthlyTrend)
                .build();
    }

    private RecordResponse mapToResponse(FinanceRecord record) {
        return RecordResponse.builder()
                .id(record.getId())
                .amount(record.getAmount())
                .type(record.getType())
                .category(record.getCategory())
                .date(record.getDate())
                .notes(record.getNotes())
                .createdAt(record.getCreatedAt())
                .userName(record.getUser().getName())
                .userEmail(record.getUser().getEmail())
                .build();
    }
}
