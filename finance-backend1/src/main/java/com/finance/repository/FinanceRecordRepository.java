package com.finance.repository;

import com.finance.model.FinanceRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FinanceRecordRepository extends JpaRepository<FinanceRecord, Long> {

    List<FinanceRecord> findByType(String type);
    List<FinanceRecord> findByCategory(String category);
    List<FinanceRecord> findByDateBetween(LocalDate start, LocalDate end);
    List<FinanceRecord> findByTypeAndCategory(String type, String category);

    @Query("SELECT SUM(r.amount) FROM FinanceRecord r WHERE r.type = 'income'")
    BigDecimal getTotalIncome();

    @Query("SELECT SUM(r.amount) FROM FinanceRecord r WHERE r.type = 'expense'")
    BigDecimal getTotalExpenses();

    @Query("SELECT r.category, SUM(r.amount) FROM FinanceRecord r GROUP BY r.category")
    List<Object[]> getCategoryTotals();

    @Query("SELECT FUNCTION('TO_CHAR', r.date, 'YYYY-MM'), r.type, SUM(r.amount) " +
            "FROM FinanceRecord r GROUP BY FUNCTION('TO_CHAR', r.date, 'YYYY-MM'), r.type ORDER BY 1")
    List<Object[]> getMonthlyTrend();

    @Query("SELECT r FROM FinanceRecord r ORDER BY r.createdAt DESC")
    List<FinanceRecord> findRecentRecords(Pageable pageable);
}