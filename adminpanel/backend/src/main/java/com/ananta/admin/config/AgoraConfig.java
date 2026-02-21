package com.ananta.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgoraConfig {

    @Value("${agora.appId}")
    private String appId;

    @Value("${agora.certificate}")
    private String certificate;

    public String getAppId() {
        return appId;
    }

    public String getCertificate() {
        return certificate;
    }
}

