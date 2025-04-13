package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable long id) {
        User user = userService.getUser(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<String> addNewUser(@RequestBody User user) {
        // Проверка на уже существующего пользователя
        User existingUser = userService.findByUsername(user.getUsername());
        if (existingUser != null) {
            return new ResponseEntity<>("User with this username is already exists", HttpStatus.NOT_ACCEPTABLE);
        }
        userService.saveUser(user);
        return new ResponseEntity<>("User was added", HttpStatus.OK);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable long id, @RequestBody User user) {
        // Проверка на существование такого
        User existingUser = userService.getUser(id);
        if (existingUser == null) {
            return new ResponseEntity<>("This user does not exist", HttpStatus.NOT_FOUND);
        }
        userService.updateUser(user);
        return new ResponseEntity<>("User with ID = " + id + " was updated", HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("User with ID = " + id + " was deleted", HttpStatus.OK);
    }

}
