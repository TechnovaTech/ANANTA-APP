package com.ananta.admin.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KycStatusResponse {
    private String userId;
    private String kycStatus;
}
