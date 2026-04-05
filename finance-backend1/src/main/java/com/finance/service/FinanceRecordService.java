package com.finance.service;

import com.finance.dto.RecordRequest;
import com.finance.dto.RecordResponse;
import com.finance.model.FinanceRecord;
import com.finance.model.User;
import com.finance.repository.FinanceRecordRepository;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceRecordService {

    private final FinanceRecordRepository recordRepository;
    private final UserRepository userRepository;

    public RecordResponse create(RecordRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FinanceRecord record = new FinanceRecord();
        record.setUser(user);
        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setNotes(request.getNotes());
        return toDTO(recordRepository.save(record));
    }

    public List<RecordResponse> getAll(String type, String category,
                                       LocalDate startDate, LocalDate endDate) {
        List<FinanceRecord> records;

        if (startDate != null && endDate != null) {
            records = recordRepository.findByDateBetween(startDate, endDate);
        } else if (type != null && category != null) {
            records = recordRepository.findByTypeAndCategory(type, category);
        } else if (type != null) {
            records = recordRepository.findByType(type);
        } else if (category != null) {
            records = recordRepository.findByCategory(category);
        } else {
            records = recordRepository.findAll();
        }

        return records.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public RecordResponse update(Long id, RecordRequest request) {
        FinanceRecord record = recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found with id: " + id));

        record.setAmount(request.getAmount());
        record.setType(request.getType());
        record.setCategory(request.getCategory());
        record.setDate(request.getDate());
        record.setNotes(request.getNotes());
        return toDTO(recordRepository.save(record));
    }

    public void delete(Long id) {
        if (!recordRepository.existsById(id)) {
            throw new RuntimeException("Record not found with id: " + id);
        }
        recordRepository.deleteById(id);
    }

    private RecordResponse toDTO(FinanceRecord record) {
        RecordResponse dto = new RecordResponse();
        dto.setId(record.getId());
        dto.setAmount(record.getAmount());
        dto.setType(record.getType());
        dto.setCategory(record.getCategory());
        dto.setDate(record.getDate());
        dto.setNotes(record.getNotes());
        return dto;
    }
}