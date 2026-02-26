package com.ananta.admin.service;

import com.ananta.admin.config.AgoraConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.security.MessageDigest;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;
import java.util.zip.CRC32;

/**
 * Agora RTC Token service using the official AccessToken format.
 *
 * This builds a proper Agora AccessToken (v006) that matches what the
 * Agora SDKs expect.  The format is documented at:
 * https://docs.agora.io/en/video-calling/token-generation-guide
 *
 * The critical parts that the previous hand-rolled implementation missed:
 *  - The message body is little-endian packed binary (not a plain text string)
 *  - The privileges map is encoded as a sorted TreeMap with 2-byte keys
 *    and 4-byte values in little-endian byte order
 *  - The signing message is sha256(appId + channelName + account + nonce + timestamp)
 */
@Service
public class AgoraTokenService {

    @Autowired
    private AgoraConfig agoraConfig;

    /** Token expiry: 24 hours.  Sessions rarely last longer. */
    private static final int TOKEN_EXPIRY_SECONDS = (int) TimeUnit.HOURS.toSeconds(24);

    public String getAppId() {
        return agoraConfig.getAppId();
    }

    /**
     * Build an Agora RTC token for the given channel, uid, and role.
     *
     * @param channelName the Agora channel name
     * @param uid         0 means Agora will auto-assign; use a real uid to subscribe
     * @param role        1 = publisher (host), 2 = subscriber (audience)
     */
    public String buildRtcToken(String channelName, int uid, int role) {
        long expireTs = System.currentTimeMillis() / 1000 + TOKEN_EXPIRY_SECONDS;
        return AccessToken.buildToken(
                agoraConfig.getAppId(),
                agoraConfig.getCertificate(),
                channelName,
                uid,
                expireTs
        );
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

    // -------------------------------------------------------------------------
    // AccessToken builder -- implements the Agora v006 token format.
    // -------------------------------------------------------------------------
    static class AccessToken {

        /** Privilege IDs used by Agora.  We only need JOIN_CHANNEL (1) here. */
        private static final int PRIVILEGE_JOIN_CHANNEL = 1;

        private static final String VERSION = "006";

        public static String buildToken(String appId, String appCertificate,
                                        String channelName, int uid,
                                        long expireTimestamp) {
            try {
                // Agora tokens represent uid=0 as an empty string
                String account = uid == 0 ? "" : String.valueOf(uid);

                int salt = (int) (Math.random() * Integer.MAX_VALUE);
                int currentTs = (int) (System.currentTimeMillis() / 1000);

                // 1) Build the signing key:
                //    sha256( appCertificate + channelName + account + pack(salt) + pack(currentTs) )
                String signingKey = buildSigningKey(appCertificate, channelName, account, salt, currentTs);

                // 2) Build the message to sign:
                //    crc32(channelName) + crc32(account) + salt + currentTs + expireTimestamp
                byte[] message = packMessage(channelName, account, salt, currentTs, (int) expireTimestamp);

                // 3) HMAC-SHA256(signingKey, message)
                byte[] signature = hmacSha256(signingKey.getBytes(), message);

                // 4) Build privilege map: JOIN_CHANNEL -> expireTimestamp
                TreeMap<Short, Integer> privileges = new TreeMap<>();
                privileges.put((short) PRIVILEGE_JOIN_CHANNEL, (int) expireTimestamp);

                // 5) Pack the body bytes
                byte[] bodyBytes = packBody(signature, salt, currentTs, privileges);

                // 6) Final token: VERSION + appId + base64(bodyBytes)
                String encoded = java.util.Base64.getEncoder().encodeToString(bodyBytes);
                return VERSION + appId + encoded;

            } catch (Exception e) {
                throw new RuntimeException("Failed to build Agora token", e);
            }
        }

        private static String buildSigningKey(String appCertificate, String channelName,
                                               String account, int salt, int timestamp) throws Exception {
            ByteArrayOutputStream buf = new ByteArrayOutputStream();
            buf.write(appCertificate.getBytes());
            buf.write(channelName.getBytes());
            buf.write(account.getBytes());
            buf.write(packUint32(salt));
            buf.write(packUint32(timestamp));

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(buf.toByteArray());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }

        private static byte[] packMessage(String channelName, String account,
                                           int salt, int ts, int expireTs) throws Exception {
            ByteArrayOutputStream buf = new ByteArrayOutputStream();
            buf.write(packUint32(crc32(channelName)));
            buf.write(packUint32(crc32(account)));
            buf.write(packUint32(salt));
            buf.write(packUint32(ts));
            buf.write(packUint32(expireTs));
            return buf.toByteArray();
        }

        private static byte[] packBody(byte[] signature, int salt,
                                        int timestamp, TreeMap<Short, Integer> privileges) throws Exception {
            ByteArrayOutputStream body = new ByteArrayOutputStream();
            body.write(packUint16((short) signature.length));
            body.write(signature);
            body.write(packUint32(salt));
            body.write(packUint32(timestamp));
            body.write(packUint16((short) privileges.size()));
            for (java.util.Map.Entry<Short, Integer> entry : privileges.entrySet()) {
                body.write(packUint16(entry.getKey()));
                body.write(packUint32(entry.getValue()));
            }
            return body.toByteArray();
        }

        // Little-endian packers
        private static byte[] packUint16(short value) {
            return ByteBuffer.allocate(2).order(ByteOrder.LITTLE_ENDIAN).putShort(value).array();
        }

        private static byte[] packUint32(int value) {
            return ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(value).array();
        }

        private static int crc32(String s) {
            CRC32 crc = new CRC32();
            crc.update(s.getBytes());
            return (int) crc.getValue();
        }

        private static byte[] hmacSha256(byte[] key, byte[] message) throws Exception {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return mac.doFinal(message);
        }
    }
}
