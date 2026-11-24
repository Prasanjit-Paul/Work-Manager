package com.task_manager.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RestClient restClient = RestClient.create();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");

        if (name.isEmpty() || email.isEmpty() || password.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, valid email, and password (6+ chars) are required."));
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email is already registered."));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setAuthProvider("LOCAL");

        return ResponseEntity.status(HttpStatus.CREATED).body(toSafeUser(userRepository.save(user)));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String password = body.getOrDefault("password", "");

        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password."));
        }

        User user = opt.get();
        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password."));
        }

        return ResponseEntity.ok(toSafeUser(user));
    }

    @PostMapping("/auth/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> body) {
        String idToken = body.get("credential");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing Google credential."));
        }

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> tokenInfo = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={token}", idToken)
                    .retrieve()
                    .body(Map.class);

            if (tokenInfo == null || tokenInfo.get("email") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Google token."));
            }

            String email = tokenInfo.get("email").toString().toLowerCase();
            String name = tokenInfo.getOrDefault("name", email.split("@")[0]).toString();
            String picture = tokenInfo.getOrDefault("picture", "").toString();

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setAvatarUrl(picture);
                newUser.setAuthProvider("GOOGLE");
                return userRepository.save(newUser);
            });

            if (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank()) {
                user.setAvatarUrl(picture);
                user = userRepository.save(user);
            }

            return ResponseEntity.ok(toSafeUser(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Google authentication failed."));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toSafeUser(u)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found.")));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found."));
        }

        User user = opt.get();
        if (body.containsKey("name") && !body.get("name").isBlank()) user.setName(body.get("name").trim());
        if (body.containsKey("role")) user.setRole(body.get("role"));
        if (body.containsKey("department")) user.setDepartment(body.get("department"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        if (body.containsKey("location")) user.setLocation(body.get("location"));
        if (body.containsKey("bio")) user.setBio(body.get("bio"));

        return ResponseEntity.ok(toSafeUser(userRepository.save(user)));
    }

    private Map<String, Object> toSafeUser(User u) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getId());
        map.put("name", u.getName());
        map.put("email", u.getEmail());
        map.put("authProvider", u.getAuthProvider());
        map.put("avatarUrl", u.getAvatarUrl() != null ? u.getAvatarUrl() : "");
        map.put("role", u.getRole() != null ? u.getRole() : "");
        map.put("department", u.getDepartment() != null ? u.getDepartment() : "");
        map.put("phone", u.getPhone() != null ? u.getPhone() : "");
        map.put("location", u.getLocation() != null ? u.getLocation() : "");
        map.put("bio", u.getBio() != null ? u.getBio() : "");
        return map;
    }
}