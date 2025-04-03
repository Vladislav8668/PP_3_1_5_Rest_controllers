package ru.kata.spring.boot_security.demo.service;



import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.entity.User;

import java.util.List;

public interface UserService extends UserDetailsService {
    void saveUser(User user);
    void updateUser(User user);
    List<User> getAllUsers();
    User getUser(long id);
    void deleteUser(long id);
    User findByUsername(String username);
}
