package com.finance.service;

import com.finance.model.Role;
import com.finance.model.User;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User changeRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmail().equals("admin@gmail.com")) {
            throw new RuntimeException("The admin seed account role cannot be changed");
        }
        user.setRole(Role.valueOf(role.toUpperCase()));
        return userRepository.save(user);
    }

    public User changeStatus(Long id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmail().equals("admin@gmail.com")) {
            throw new RuntimeException("The admin seed account cannot be deactivated");
        }
        user.setIsActive(isActive);
        return userRepository.save(user);
    }
}