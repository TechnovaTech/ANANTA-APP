package com.ananta.admin.service;

import com.ananta.admin.config.AgoraConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class AgoraTokenService {

    @Autowired
    private AgoraConfig agoraConfig;

    // 2 hours expiry for live session tokens
    private static final int TOKEN_EXPIRY_SECONDS = (int) TimeUnit.HOURS.toSeconds(2);

    public String getAppId() {
        return agoraConfig.getAppId();
    }

    public String buildRtcToken(String channelName, int uid, int role) {
        long currentTs = System.currentTimeMillis() / 1000;
        long expireTs = currentTs + TOKEN_EXPIRY_SECONDS;
        String appId = agoraConfig.getAppId();
        String certificate = agoraConfig.getCertificate();
        return RtcTokenBuilder.buildToken(appId, certificate, channelName, uid, role, expireTs);
    }

    public enum RtcRole {
        PUBLISHER(1),
        SUBSCRIBER(2);

        private final int value;

        RtcRole(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    /**
     * Minimal RTC token builder implementation based on Agora docs.
     * Uses AccessToken format with single privilege: JoinChannel.
     */
    static class RtcTokenBuilder {
        private static final String VERSION = "006";

        public static String buildToken(
                String appId,
                String certificate,
                String channelName,
                int uid,
                int role,
                long expireTimestamp
        ) {
            String account = uid == 0 ? "" : String.valueOf(uid);
            AccessToken token = new AccessToken(appId, certificate, channelName, account);
            token.addPrivilege(AccessToken.Privileges.JOIN_CHANNEL, expireTimestamp);
            return VERSION + token.build();
        }
    }

    /**
     * Very small AccessToken helper to sign token. This follows the structure:
     * appId + channelName + account + salt + ts as message for HMAC-SHA256.
     */
    static class AccessToken {
        enum Privileges {
            JOIN_CHANNEL(1);

            private final int intValue;

            Privileges(int value) {
                this.intValue = value;
            }
        }

        private final String appId;
        private final String appCertificate;
        private final String channelName;
        private final String account;
        private long expireTs;

        AccessToken(String appId, String appCertificate, String channelName, String account) {
            this.appId = appId;
            this.appCertificate = appCertificate;
            this.channelName = channelName;
            this.account = account;
        }

        void addPrivilege(Privileges privilege, long expireTs) {
            this.expireTs = expireTs;
        }

        String build() {
            try {
                int salt = (int) (Math.random() * Integer.MAX_VALUE);
                long ts = System.currentTimeMillis() / 1000;
                String message = appId + channelName + account + salt + ts + expireTs;
                String signature = hmacSha256(appCertificate, message);
                String body = String.format("%s:%s:%d:%d:%d", appId, signature, salt, ts, expireTs);
                return Base64Encoder.encode(body.getBytes());
            } catch (Exception e) {
                return "";
            }
        }

        private static String hmacSha256(String key, String message) throws Exception {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec spec =
                    new javax.crypto.spec.SecretKeySpec(key.getBytes(), "HmacSHA256");
            mac.init(spec);
            byte[] result = mac.doFinal(message.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }
    }

    static class Base64Encoder {
        static String encode(byte[] data) {
            return java.util.Base64.getEncoder().encodeToString(data);
        }
    }
}

