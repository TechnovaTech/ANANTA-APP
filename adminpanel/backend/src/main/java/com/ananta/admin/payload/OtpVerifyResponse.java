package com.ananta.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OtpVerifyResponse {
    private String userId;
    private String phone;
    private String kycStatus;
    private boolean hasProfile;
}
