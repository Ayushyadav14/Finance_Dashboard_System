package com.finance.repository;

import com.finance.model.FinanceRecord;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FinanceRecordRepository extends JpaRepository<FinanceRecord, Long>, JpaSpecificationExecutor<FinanceRecord> {

    @Query("SELECT SUM(r.amount) FROM FinanceRecord r WHERE r.type = 'income'")
    BigDecimal getTotalIncome();

    @Query("SELECT SUM(r.amount) FROM FinanceRecord r WHERE r.type = 'expense'")
    BigDecimal getTotalExpenses();

    @Query("SELECT r.category, SUM(r.amount) FROM FinanceRecord r GROUP BY r.category")
    List<Object[]> getCategoryTotals();

    @Query("SELECT TO_CHAR(r.date, 'YYYY-MM'), r.type, SUM(r.amount) FROM FinanceRecord r GROUP BY TO_CHAR(r.date, 'YYYY-MM'), r.type ORDER BY TO_CHAR(r.date, 'YYYY-MM')")
    List<Object[]> getMonthlyTrend();

    @Query("SELECT r FROM FinanceRecord r ORDER BY r.createdAt DESC")
    List<FinanceRecord> findTop5Recent(Pageable pageable);
}
