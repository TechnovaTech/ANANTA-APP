package com.ananta.admin.payload;

import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String phone;
    private String otp;
}
