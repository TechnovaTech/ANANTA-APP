package com.ananta.admin.config;

import com.ananta.admin.payload.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        System.out.println("=== GLOBAL EXCEPTION CAUGHT ===");
        System.out.println("Request: " + request.getDescription(false));
        System.out.println("Exception: " + ex.getClass().getName());
        System.out.println("Message: " + ex.getMessage());
        ex.printStackTrace();
        System.out.println("=== END EXCEPTION ===");
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Server error: " + ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex, WebRequest request) {
        System.out.println("=== RUNTIME EXCEPTION ===");
        System.out.println("Request: " + request.getDescription(false));
        System.out.println("Message: " + ex.getMessage());
        ex.printStackTrace();
        System.out.println("=== END EXCEPTION ===");
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Runtime error: " + ex.getMessage()));
    }
}
