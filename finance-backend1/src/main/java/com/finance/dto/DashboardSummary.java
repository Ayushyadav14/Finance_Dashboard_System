package com.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class DashboardSummary {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private List<Map<String, Object>> byCategory;
    private List<RecordResponse> recentRecords;
    private List<Map<String, Object>> monthlyTrend;
}