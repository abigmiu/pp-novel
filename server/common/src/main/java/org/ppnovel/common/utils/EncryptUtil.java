package org.ppnovel.common.utils;

import org.springframework.util.DigestUtils;


public class EncryptUtil {
    public static String encryptWebUserPassword(String password, String signKey) {
        String saltPassword = password + signKey;
        return DigestUtils.md5DigestAsHex(saltPassword.getBytes());
    }

    /**
     * 邮箱脱敏
     */
    public static String emailDesensitization(String email) {
        String[] split = email.split("@");
        String prefix = split[0];
        String suffix = split[1];
        int length = prefix.length();
        if (length <= 3) {
            return prefix.substring(0, 1) + "****" + prefix.substring(length - 1) + "@" + suffix;
        }
        return prefix.substring(0, 2) + "****" + prefix.substring(length - 2) + "@" + suffix;
    }

    /**
     * 手机号脱敏
     */
    public static String phoneDesensitization(String phone) {
        if (phone == null) {
            return null;
        }
        return phone.substring(0, 3) + "****" + phone.substring(7);
    }

    /**
     * qq 脱敏
     */
    public static String qqDesensitization(String qq) {
        if (qq == null) {
            return null;
        }
        return qq.substring(0, 3) + "****" + qq.substring(7);
    }
}
