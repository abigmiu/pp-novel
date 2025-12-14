package org.ppnovel.web.util;

import cn.dev33.satoken.stp.StpUtil;

public class SaTokenUtil {
    public static Integer getUserId() {
        if (StpUtil.getLoginId() != null) {
            return StpUtil.getLoginIdAsInt();
        }
        return null;
    }
}
