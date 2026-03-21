package com.groupsguru.auth;

import com.groupsguru.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public ApiResponse<String> securedEndpoint() {

        return ApiResponse.<String>builder()
                .success(true)
                .message("Access granted")
                .data("Secure data")
                .build();
    }
}
