package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

//    ------------Из 3_1_4----------------
//    @PostMapping("/saveUser")
//    public String saveUser(@ModelAttribute("user") User user) {
//        User existingUser = userService.findByUsername(user.getUsername());
//        if (existingUser != null) {
//            return "redirect:/admin";
//        }
//        userService.saveUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/editUser")
//    public String editUser(@ModelAttribute("userEdited") User user) {
//        userService.updateUser(user);
//        return "redirect:/admin";
//    }
//
//    @PostMapping("/deleteUser")
//    public String deleteUser(@RequestParam("userId") int id) {
//        userService.deleteUser(id);
//        return "redirect:/admin";
//    }



//    -----------Из заурчика-----------
    @GetMapping("/users")
    public List<User> showAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return allUsers;
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable int id) {
        User user = userService.getUser(id);
        return user;
    }

    @PostMapping("/users")
    public User addNewUser(@RequestBody User user) {
        // Проверка на уже существующего
        User existingUser = userService.findByUsername(user.getUsername());
        if (existingUser != null) {
            return null;
        }
        userService.saveUser(user);
        return user;
    }

    @PutMapping("/users")
    public User updateUser(@RequestBody User user) {
        // Проверка на существование такого
        User existingUser = userService.getUser(user.getId());
        if (existingUser == null) {
            return null;
        }
        userService.updateUser(user);
        return user;
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return "User with ID = " + id + " was deleted";
    }

}
