package com.ssafy.booknest.global.error;

import com.ssafy.booknest.global.common.response.ApiResponse;
import com.ssafy.booknest.global.error.exception.CustomException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ApiResponse<Object>> handleCustomException(CustomException e, HttpServletRequest request) {
        if (!e.getParameters().isEmpty()) {
            log.error("[CustomException] {} {}: {} - Parameters: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    e.getMessage(),
                    e.getParameters()
            );
        } else {
            log.error("[CustomException] {} {}: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    e.getMessage()
            );
        }

        return ApiResponse.error(e.getErrorCode());
    }
}
