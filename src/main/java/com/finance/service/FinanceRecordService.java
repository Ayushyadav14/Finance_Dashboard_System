package com.finance.service;

import com.finance.dto.RecordRequest;
import com.finance.dto.RecordResponse;
import com.finance.model.FinanceRecord;
import com.finance.model.User;
import com.finance.repository.FinanceRecordRepository;
import com.finance.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceRecordService {

    private final FinanceRecordRepository recordRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public RecordResponse createRecord(RecordRequest request) {
        User user = getAuthenticatedUser();
        FinanceRecord record = FinanceRecord.builder()
                .user(user)
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();
        FinanceRecord saved = recordRepository.save(record);
        return mapToResponse(saved);
    }

    public List<RecordResponse> getAllRecords(String type, String category, LocalDate startDate, LocalDate endDate) {
        Specification<FinanceRecord> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (type != null) predicates.add(cb.equal(root.get("type"), type));
            if (category != null) predicates.add(cb.equal(root.get("category"), category));
            if (startDate != null) predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            if (endDate != null) predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return recordRepository.findAll(spec).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public RecordResponse updateRecord(Long id, RecordRequest request) {
        FinanceRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setNotes(request.getNotes());
        FinanceRecord updated = recordRepository.save(record);
        return mapToResponse(updated);
    }

    public void deleteRecord(Long id) {
        if (!recordRepository.existsById(id)) {
            throw new RuntimeException("Record not found");
        }
        recordRepository.deleteById(id);
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
