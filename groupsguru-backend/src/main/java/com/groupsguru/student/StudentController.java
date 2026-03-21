package com.groupsguru.student;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @GetMapping("/test")
    public ResponseEntity<String> studentTest() {
        return ResponseEntity.ok("Student access granted");
    }
}
